import {
  Autocomplete,
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import TopBar from "../components/TopBar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { UI_PATH_STOCK } from "../constants/paths";
import { useEffect, useState } from "react";
import axios, { HttpStatusCode } from "axios";
import { useAuth } from "../providers/AuthProvider";
import { toast } from "react-toastify";
import { IStockAddFormField } from "../types/FormFieldTypes";
import { IItemResponse, IStockResponse } from "../types/ResponseTypes";
import {
  GET_ALL_ITEMS_URL,
  POST_CREATE_STOCK_URL,
} from "../constants/requestUrls";
import { useFormik } from "formik";
import { ItemListType } from "../types/types";
import { AddStockSchema } from "../schema/AddStockSchema";
import { Status } from "../constants/enum/StatusEnum";

const AddStockPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [items, setItems] = useState<ItemListType[]>([]);

  useEffect(() => {
    axios
      .get<IItemResponse[]>(GET_ALL_ITEMS_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const itemList: ItemListType[] = [];
        response.data.map((item) => {
          if (item.status !== Status.DELETE) {
            return itemList.push({ label: item.name, id: item.id });
          }
        });
        setItems(itemList);
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          console.log(error);
          toast.error(error.message);
        }
      });
  }, []);

  const handleSubmit = (values: IStockAddFormField) => {
    const data = {
      itemId: values.item?.id,
      qty: values.qty,
    };
    axios
      .post<IStockResponse>(POST_CREATE_STOCK_URL, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === HttpStatusCode.Created) {
          navigate(UI_PATH_STOCK);
          toast.success("Stock Added");
        }
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          console.log(error);
          if (error.status == HttpStatusCode.InternalServerError) {
            toast.error(error.response?.data.detail);
          } else {
            toast.error(error.response?.data.description);
          }
        }
      });
  };

  const formik = useFormik<IStockAddFormField>({
    initialValues: {
      qty: 0,
      item: null,
    },
    validationSchema: AddStockSchema,
    onSubmit: handleSubmit,
  });

  return (
    <Container>
      <TopBar />
      <Box
        sx={{
          my: 15,
        }}
      >
        <Box>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            color="success"
            sx={{
              mb: 4,
            }}
            onClick={() => navigate(UI_PATH_STOCK)}
          >
            Back
          </Button>

          <Typography variant="h3" textAlign={"center"} color={"s"}>
            Add Stock
          </Typography>

          <Box mt={5}>
            <Grid
              container
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                flexGrow: 1,
              }}
              spacing={4}
              component={"form"}
              onSubmit={formik.handleSubmit}
            >
              <Grid item width={"100%"}>
                <Autocomplete
                  disablePortal
                  id="item"
                  options={items}
                  onOpen={formik.handleBlur}
                  onChange={(event, value) => {
                    formik.setFieldValue("item", value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="item"
                      label="Item"
                      error={formik.touched.item && Boolean(formik.errors.item)}
                      helperText={formik.touched.item && formik.errors.item}
                    />
                  )}
                />
              </Grid>
              <Grid item width={"100%"}>
                <TextField
                  fullWidth
                  variant="outlined"
                  id="qty"
                  name="qty"
                  label="Quantity"
                  value={formik.values.qty}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.qty && Boolean(formik.errors.qty)}
                  helperText={formik.touched.qty && formik.errors.qty}
                />
              </Grid>

              <Grid item width={"100%"}>
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  type="submit"
                  sx={{
                    py: 2,
                  }}
                  fullWidth
                >
                  Add Stock
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default AddStockPage;

import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import TopBar from "../../components/TopBar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { UI_PATH_ITEM } from "../../constants/paths";
import { useEffect, useState } from "react";
import axios, { HttpStatusCode } from "axios";
import { useAuth } from "../../providers/AuthProvider";
import { toast } from "react-toastify";
import { IItemAddFormField } from "../../types/FormFieldTypes";
import {
  IItemCategoryResponse,
  IItemResponse,
} from "../../types/ResponseTypes";
import { ITEMS_BASE_URL } from "../../constants/request-urls";
import { AddItemSchema } from "../../schema/AddItemSchema";
import { useFormik } from "formik";
import { ITEM_CATEGORIES_BASE_URL } from "../../constants/request-urls";

const AddItemPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [categories, setCategories] = useState<IItemCategoryResponse[]>([]);

  useEffect(() => {
    axios
      .get<IItemCategoryResponse[]>(ITEM_CATEGORIES_BASE_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setCategories(response.data))
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          console.log(error);
          toast.error(error.message);
        }
      });
  }, []);

  const handleSubmit = (values: IItemAddFormField) => {
    const data = {
      name: values.name,
      unitPrice: values.price,
      category: values.category,
    };
    axios
      .post<IItemResponse>(ITEMS_BASE_URL, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === HttpStatusCode.Created) {
          navigate(UI_PATH_ITEM);
          toast.success(`Item Created ${response.data.name}`);
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

  const formik = useFormik({
    initialValues: {
      name: "",
      price: 0,
      category: "",
    },
    validationSchema: AddItemSchema,
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
            onClick={() => navigate(UI_PATH_ITEM)}
          >
            Back
          </Button>

          <Typography variant="h3" textAlign={"center"} color={"s"}>
            Add Item
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
                <TextField
                  fullWidth
                  variant="outlined"
                  id="name"
                  name="name"
                  label="Item Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>
              <Grid item width={"100%"}>
                <TextField
                  fullWidth
                  variant="outlined"
                  id="price"
                  name="price"
                  label="Unit Price"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.price && Boolean(formik.errors.price)}
                  helperText={formik.touched.price && formik.errors.price}
                />
              </Grid>

              <Grid item width={"100%"}>
                <FormControl fullWidth>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    id="category"
                    label="Category"
                    name="category"
                    value={formik.values.category}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.category && Boolean(formik.errors.category)
                    }
                  >
                    {categories.map((category) => (
                      <MenuItem value={category.name}>{category.name}</MenuItem>
                    ))}
                  </Select>
                  <FormHelperText error>
                    {formik.touched.category && formik.errors.category}
                  </FormHelperText>
                </FormControl>
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
                  Add Item
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default AddItemPage;

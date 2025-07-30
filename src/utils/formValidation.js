import Joi from "joi";
import { FORM_SCHEMAS } from "../constants/forms/formSchema";

export const validateFormByType = async (formType, formData) => {
  const schemaFile = FORM_SCHEMAS[formType];

  if (!schemaFile) {
    throw new Error(`Unknown form type: ${formType}`);
  }

  const { default: schema } = await import(`../constants/forms/validationSchemas/${schemaFile}.js`);
  return validateForm(schema, formData);
};

const validateForm = (schema, formData) => {
  const { error } = Joi.object(schema).validate(formData, {
    abortEarly: false,
  });

  if (!error) return null;

  const validationErrors = {};
  for (let item of error.details) {
    validationErrors[item.path[0]] = item.message;
  }

  return validationErrors;
};



// export const validateLogInForm = (formData) => {
//   const schema = {
//     email: Joi.string()
//       .email({ tlds: { allow: false } })
//       .required(),
//     password: Joi.string().min(5).required(),
//   };

//   const { error } = Joi.object(schema).validate(formData, {
//     abortEarly: false,
//   });
//   if (!error) return null;

//   const validationErrors = {};
//   for (let item of error.details) {
//     validationErrors[item.path[0]] = item.message;
//   }

//   return validationErrors;
// };

// export const validateAddBrandForm = (formData) => {
//   const schema = Joi.object({
//     brandName: Joi.string().required().label("Brand Name"),
//     brandImage: Joi.any().label("Brand Image"),
//   });

//   const { error } = schema.validate(formData, { abortEarly: false });
//   if (!error) return null;

//   const validationErrors = {};
//   for (let item of error.details) {
//     validationErrors[item.path[0]] = item.message;
//   }

//   return validationErrors;
// };

// export const validateEditBrandForm = (formData) => {
//   const schema = Joi.object({
//     brandName: Joi.string().required().label("Brand Name"),
//   });
//   const { error } = schema.validate(formData, { abortEarly: false });
//   if (!error) return null;
//   const validationErrors = {};
//   for (let item of error.details) {
//     validationErrors[item.path[0]] = item.message;
//   }
//   return validationErrors;
// };

// export const validateAddProductForm = (formData) => {
//   const { brandId, ...formDataWithoutBrandId } = formData;
//   const schema = Joi.object({
//     productImage: Joi.any().label("Product Image"),
//     productName: Joi.string().required().label("Product Name"),
//     category: Joi.string().required().label("Category"),
//     purchasePrice: Joi.number().min(0).required().label("Purchase Price"),
//     retailPrice: Joi.number().min(0).required().label("Retail Price"),
//     offerPer: Joi.number().min(0).max(100).label("Offer Percentage"),
//     threshold: Joi.number().min(0).required().label("Threshold"),
//     stock: Joi.number().min(0).required().label("Stock"),
//     description: Joi.string().allow("").label("Description"),
//   });
//   const { error } = schema.validate(formDataWithoutBrandId, {
//     abortEarly: false,
//   });
//   const validationErrors = {};
//   if (!error) return validationErrors;
//   for (let item of error.details) {
//     validationErrors[item.path[0]] = item.message;
//   }
//   return validationErrors;
// };

// export const validateEditProductForm = (formData) => {
//   // Remove _id and brandId from formData
//   const { _id, brandId, __v, ...formDataWithoutIdAndBrandId } = formData;

//   const schema = Joi.object({
//     productImage: Joi.any().required().label("Product Image"),
//     productName: Joi.string().required().label("Product Name"),
//     category: Joi.string().required().label("Category"),
//     purchasePrice: Joi.number().min(0).required().label("Purchase Price"),
//     retailPrice: Joi.number().min(0).required().label("Retail Price"),
//     offerPer: Joi.number().min(0).max(100).label("Offer Percentage"),
//     threshold: Joi.number().min(0).required().label("Threshold"),
//     stock: Joi.number().min(0).required().label("Stock"),
//     description: Joi.string().allow("").label("Description"),
//   });

//   const { error } = schema.validate(formDataWithoutIdAndBrandId, {
//     abortEarly: false,
//   });
//   const validationErrors = {};
//   if (!error) return validationErrors;

//   for (let item of error.details) {
//     validationErrors[item.path[0]] = item.message;
//   }

//   return validationErrors;
// };

// export const validateOrderForm = (formData) => {
//   const orderFormSchema = Joi.object({
//     clientName: Joi.string().required().label("Client Name"),
//     clientEmail: Joi.string()
//       .email({ tlds: { allow: false } })
//       .required(),
//     clientContact: Joi.string().required().label("Client Contact"),
//     clientAddress: Joi.string().required().label("Client Address"),
//     orderDate: Joi.date().iso().required().label("Order Date"),
//     products: Joi.array()
//       .items(
//         Joi.object({
//           id: Joi.string().required().label("Product ID"),
//           productName: Joi.string().required().label("Product Name"),
//           quantity: Joi.number().integer().min(1).required().label("Quantity"),
//           offerPer: Joi.number()
//             .integer()
//             .min(0)
//             .max(100)
//             .label("Offer Percentage"),
//           purchasePrice: Joi.number().required().label("Purchase Price"),
//           retailPrice: Joi.number().required().label("Retail Price"),
//           total: Joi.number().required().label("Total"),
//         })
//       )
//       .required()
//       .label("Products"),
//     netTotal: Joi.number().required().label("Net Total"),
//     profit: Joi.number().required().label("Profit"),
//   });

//   const { error } = orderFormSchema.validate(formData, { abortEarly: false });
//   if (!error) return null;
//   const validationErrors = {};
//   for (const detail of error.details) {
//     validationErrors[detail.context.key] = detail.message;
//   }
//   return validationErrors;
// };

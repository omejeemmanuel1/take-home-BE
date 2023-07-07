import Joi from 'joi'

export const loginUserSchema = Joi.object().keys({
    email: Joi.string().email().trim().lowercase().required(),
    password: Joi.string().trim().regex(/^[a-zA-Z0-9]{3,30}$/).required()
})


export const createProductSchema = Joi.object().keys({
    numberCompanies: Joi.number().required(),
    numberProducts: Joi.number().required(),
  });  
  

export const options = {
    abortEarly:false,
    errors:{
        wrap:{
            label:''
        }
    }
}

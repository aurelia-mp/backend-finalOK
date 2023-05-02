import mongoose from "mongoose";

const users = "usuarios"
const Schema = mongoose.Schema

const usuariosSchema = new Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    tel: {type: String, required: false},
    password: {type: String, required: true},
    admin: {type: Boolean, required:true}
}
)

export const usuarios = mongoose.model(users, usuariosSchema)
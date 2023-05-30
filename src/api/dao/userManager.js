import mongoose from "mongoose";
import crypto from 'crypto';
import userModel from "./models/user.model.js"

class UserManager {
    constructor() {
        this.uStatus = 1
    }

    static #encryptPassword = (pass) => {
        return crypto.createHash("sha256").update(pass).digest("hex")
    }
    static #findUser = async (email) => {
        const existUser = await userModel.find({ "userEmail": email }).lean()
        return existUser
    }
    createUser = async (nuevoUser) => {
        try {

            let userExist = await UserManager.#findUser(nuevoUser.userEmail)
            if (userExist == "") {
                nuevoUser.userPassword = UserManager.#encryptPassword(nuevoUser.userPassword)
                nuevoUser.userRol="user"
                const nUser = await userModel.create(nuevoUser)
                return nUser
            }
            else {
                return false
            }
        } catch (e) {
            console.log(e.message)
        }
    }
    validateUser = async (userEmail, userPassword) => {
        try {
            userPassword = UserManager.#encryptPassword(userPassword)
            let validated = await userModel.findOne({ userEmail: userEmail, userPassword: userPassword })
            return validated

        } catch (e) {
            console.log(e.msg)
        }
    }
}

export default UserManager
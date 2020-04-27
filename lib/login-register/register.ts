import db from '../db/connect';
import * as bcrypt from 'bcryptjs';
import { Observable } from 'rxjs';
import { Request, Response } from "express";

export default class Register {
    req: Request;
    res: Response;

    constructor(req, res) {
        this.req = req;
        this.res = res;
    }

    register(req, res) {
        console.log(req.body);

        let connection = db.getConnection();
        var users = {
            "firstName": req.body.firstName,
            "lastName": req.body.lastName,
            "email": req.body.email,
            "phone": req.body.phone,
            "password": req.body.password
        };
        connection.query('SELECT COUNT(*) AS cnt FROM users WHERE email = ?', this.req.body.email, (error, results, fields) => {
            console.log(results[0].cnt);
            if (results[0].cnt === 0) {
                connection.query('INSERT INTO users SET ?', users, function (error, results, fields) {
                    if (error) {

                    } else {
                        res.json({
                            message: "Successfuly registered"
                        });
                    }
                    //database.end();
                });
            } else {
                res.json({
                    message: "User already exixts"
                });
            }
        });
    }
}

//export default new Register();
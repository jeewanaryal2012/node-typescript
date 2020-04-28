import db from '../db/connect';
import * as bcrypt from 'bcryptjs';
import { Observable } from 'rxjs';
import { Request, Response } from "express";

export default class Register {
    req: Request;
    res: Response;
    connection: any;

    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.connection = db.getConnection();
    }

    register(req, res) {
        console.log(req.body);

        //let connection = db.getConnection();
        var users = {
            "firstName": req.body.firstName,
            "lastName": req.body.lastName,
            "email": req.body.email,
            "phone": req.body.phone,
            "password": req.body.password
        };
        this.connection.query('SELECT COUNT(*) AS cnt FROM users WHERE email = ?', this.req.body.email, (error, results, fields) => {
            console.log(results[0].cnt);
            if (results[0].cnt === 0) {
                this.connection.query('INSERT INTO users SET ?', users, function (error, results, fields) {
                    if (error) {

                    } else {
                        res.json({
                            registered: true,
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

    userExists(req, res) {
        this.connection.query('SELECT COUNT(*) AS cnt FROM users WHERE email = ?', req.body.email, (error, results, fields) => {
            if (results[0].cnt === 0) {
                res.json({
                    userExists: false
                });
            } else {
                res.json({
                    userExists: true
                })
            }
        });
    }
}

//export default new Register();
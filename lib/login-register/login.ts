import db from '../db/connect';
import * as bcrypt from 'bcryptjs';
import { Observable } from 'rxjs';
import { Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import UserProfile from '../user/user-profile';
import * as fs from 'fs';
import * as path from 'path';

export default class Login {
    req: Request;
    res: Response;
    connection: any;

    constructor() {
        // this.req = req;
        // this.res = res;
        this.connection = db.getConnection();
    }

    // bcrypt.compareSync('somePassword', hash)
    login(req, res) {

        this.connection.query('SELECT * FROM users WHERE email = ?', [req.body.email], (error, results, fields) => {
            if (results.length > 0) {
                bcrypt.compare(req.body.password, results[0].password, (err, match) => {
                    if (match) {
                        let ts = Date.now();
                        const user = { username: req.body.username, password: req.body.password };
                        const accessToken = jwt.sign(user, process.env.AUTH_KEY);
                        let diff = this.loginDiff(new Date(parseInt(results[0].lastLogin)), new Date(ts));
                        if (true) {
                            let userProfile = new UserProfile();
                            userProfile.getUserProfile(req.body.email).subscribe(up => {
                                console.log(process.env.PWD + '/uploads/default/profile-default.png');
                                //console.log(fs.readFileSync(process.env.PWD + '/uploads/default/profile-default.png'));
                                let bitmap = fs.readFileSync(process.env.PWD + '/uploads/default/profile-default.png');
                                let prof = new Buffer(bitmap).toString('base64');
                                res.json({
                                    userProfileId: up[0].userProfileId,
                                    profilePicture: up[0].profilePicture,
                                    email: up[0].email,
                                    result: true,
                                    userName: req.body.email,
                                    accessToken
                                });
                            }, err => { });
                            // this.update(ts, req.body.email);
                            // res.json({
                            //     result: true,
                            //     userName: req.body.email,
                            //     role: 'manager',
                            //     timestamp: ts,
                            //     accessToken
                            // });
                        } else {
                            res.json([{
                                result: false
                            }]);
                        }
                    } else {
                        res.json([{
                            result: false
                        }]);
                    }
                });
            } else {
                res.json([{
                    result: false
                }]);
            }
        });
        // res.json([{
        //     result: 'ok'
        // }]);
    }

    update(stamp, email) {
        let sql = `UPDATE users SET lastLogin = ? WHERE email = ?`;
        let data = [stamp, email];

        db.getConnection().query(sql, data, function (error, results, fields) {
            if (error) {

            } else {
            }
            //database.end();
        });
    }

    loginDiff(dt2, dt1) {
        let diff = (dt2.getTime() - dt1.getTime()) / 1000;
        diff /= 60;
        return Math.abs(Math.round(diff));
    }
}

//export default new Register();
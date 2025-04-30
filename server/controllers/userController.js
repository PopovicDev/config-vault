import pool from '../config/db.js';

export const getUserData = async(req, res) => {
    try{
        const {userId} = req.body;
        const user = await pool.query('SELECT name, surname, username, "isAccountVerified", email FROM cfgvault."USERS" WHERE user_id = $1', [userId]);

        if(user.rows.length === 0){
            return res.json({success: false, message: "User not found"});
        }

        res.json({
            success: true,
            userData: {
                name: user.rows[0].name,
                surname: user.rows[0].surname,
                username: user.rows[0].username,
                isAccountVerified: user.rows[0].isAccountVerified,
                email: user.rows[0].email,
            }
        });
    }
    catch(error){
        res.json({success: false, message: error.message});
    }
}
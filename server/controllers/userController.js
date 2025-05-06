import pool from '../config/db.js';

export const getUserData = async(req, res) => {
    try{
        const {userId} = req.body;
        const user = await pool.query('SELECT name, surname, username, "isAccountVerified", email FROM cfgvault."USERS" WHERE user_id = $1', [userId]);
        const followers = await pool.query('SELECT f.follower_id, u.username FROM cfgvault."FOLLOWERS" f JOIN cfgvault."USERS" u ON f.follower_id = u.user_id WHERE f.user_id = $1', [userId]);

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
                followers: followers.rows.length === 0 ? '' : followers.rows
            }
        });
    }
    catch(error){
        res.json({success: false, message: error.message});
    }
}

export const getUserProfile = async(req, res) => {
    try{
        const {userId} = req.body;
        const {username} = req.params;
        const user = await pool.query('SELECT user_id, name, surname, username FROM cfgvault."USERS" WHERE username = $1', [username]);
        const followingStatus = await pool.query('SELECT follower_id FROM cfgvault."FOLLOWERS" WHERE user_id = $1 AND follower_id = $2', [userId, user.rows[0].user_id]);
        const followingCount = await pool.query('SELECT COUNT(follower_id) AS following FROM cfgvault."FOLLOWERS" WHERE user_id = $1', [user.rows[0].user_id]);
        const followersCount = await pool.query('SELECT COUNT(follower_id) AS followers FROM cfgvault."FOLLOWERS" WHERE follower_id = $1', [user.rows[0].user_id]);

        if(user.rows.length === 0){
            return res.json({success: false, message: "User not found"});
        }

        res.json({
            success: true,
            userData: {
                userId: user.rows[0].user_id,
                name: user.rows[0].name,
                surname: user.rows[0].surname,
                username: user.rows[0].username,
                followingStatus: followingStatus.rows.length === 0 ? false : true,
                followingCount: followingCount.rows.length === 0 ? '0' : followingCount.rows,
                followersCount: followersCount.rows.length === 0 ? '0' : followersCount.rows
            },
        })
    }
    catch(error){
        res.json({success: false, message: error.message});
    }
}

export const getAllUsers = async(req, res) => {
    try{
        const users = await pool.query('SELECT username FROM cfgvault."USERS"');
        if(users.rows.length === 0){
            return res.json({success: false, message: "No users found"});
        }

        res.json({
            success: true,
            users: users.rows
        })
    }
    catch(error){
        res.json({success: false, message: error.message});
    }
}

export const addFollower = async(req, res) => {
    try{
        const {userId, followerId} = req.body;
        const user = await pool.query('SELECT * FROM cfgvault."USERS" WHERE user_id = $1', [userId]);
        const follower = await pool.query('SELECT * FROM cfgvault."USERS" WHERE user_id = $1', [followerId]);

        if(user.rows.length === 0 || follower.rows.length === 0){
            return res.json({success: false, message: "User not found"});
        }

        await pool.query('INSERT INTO cfgvault."FOLLOWERS" (user_id, follower_id) VALUES ($1, $2)', [userId, followerId]);

        res.json({
            success: true,
            message: "Follower added successfully"
        })
    }
    catch(error){
        res.json({success: false, message: error.message});
    }
}

export const removeFollower = async(req, res) => {
    try{
        const {userId, followerId} = req.body;
        const user = await pool.query('SELECT * FROM cfgvault."USERS" WHERE user_id = $1', [userId]);
        const follower = await pool.query('SELECT * FROM cfgvault."USERS" WHERE user_id = $1', [followerId]);

        if(user.rows.length === 0 || follower.rows.length === 0){
            return res.json({success: false, message: "User not found"});
        }

        await pool.query('DELETE FROM cfgvault."FOLLOWERS" WHERE user_id = $1 AND follower_id = $2', [userId, followerId]);

        res.json({
            success: true,
            message: "Follower removed successfully"
        })
    }
    catch(error){
        res.json({success: false, message: error.message});
    }
}
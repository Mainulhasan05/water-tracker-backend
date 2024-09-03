const User=require('../models/User');
const WaterLog=require('../models/WaterLog');

exports.getDashboard=async(req,res)=>{
    try{
        // get all users
        const users=await User.find({});
        // get all water logs
        const waterLogs=await WaterLog.find({});
        // get total water consumed
        let totalWaterConsumed=0;
        waterLogs.forEach((log)=>{
            totalWaterConsumed+=log.waterConsumed;
        });
        // get total users
        const totalUsers=users.length;
        // get total water logs
        const totalWaterLogs=waterLogs.length;
        // get average water consumed
        const averageWaterConsumed=totalWaterConsumed/totalWaterLogs;
        // get average water consumed per user
        const averageWaterConsumedPerUser=totalWaterConsumed/totalUsers;
        // get user with most water consumed
        let userWithMostWaterConsumed;
        let maxWaterConsumed=0;
        waterLogs.forEach((log)=>{
            if(log.waterConsumed>maxWaterConsumed){
                maxWaterConsumed=log.waterConsumed;
                userWithMostWaterConsumed=log.user;
            }
        });
        // return response
        res.status(200).json({
            success:true,
            data:{
                users,
                waterLogs,
                totalUsers,
                totalWaterLogs,
                totalWaterConsumed,
                averageWaterConsumed,
                averageWaterConsumedPerUser,
                userWithMostWaterConsumed
            }
        });
    }
    catch(error){
        console.error(error);
        res.status(500).json({
            success:false,
            message:'Internal server error'
        });
    }
}
exports.getWaterLogs=async(req,res)=>{
    try{
        // get all water logs
        const waterLogs=await WaterLog.find({}).populate('user');
        // return response
        res.status(200).json({
            success:true,
            data:waterLogs
        });
    }
    catch(error){
        console.error(error);
        res.status(500).json({
            success:false,
            message:'Internal server error'
        });
    }
}
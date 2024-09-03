const User=require('../models/User');
const WaterLog=require('../models/WaterLog');

exports.getDashboard=async(req,res)=>{
    try{
        // get all users
        const users=await User.find({});
        // get all water logs
        
        
        // get waterlogs of today
        const today=new Date();
        today.setHours(0,0,0,0);
        const tomorrow=new Date(today);
        tomorrow.setDate(tomorrow.getDate()+1);
        const waterLogsToday=await WaterLog.find({date:{$gte:today,$lt:tomorrow}}).populate('user updatedBy');
        // water logs of last 7 days other than today
        const last7Days=new Date(today);
        last7Days.setDate(last7Days.getDate()-7);
        const waterLogsLast7Days=await WaterLog.find({date:{$gte:last7Days,$lt:today}}).populate('user updatedBy');

        // group by user and get total water consumed
        const waterLogsByUser= await WaterLog.aggregate([
            {
                $group:{
                    _id:'$user',
                    totalWaterInserted:{$sum:'$numberOfJugs'}
                }
            }
        ]);

        // return response
        res.status(200).json({
            success:true,
            data:{
                users,
                waterLogsToday,
                waterLogsByUser,
                waterLogsLast7Days  
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

// get history of water logs, date wise,in which date which user consumed how much water
exports.getHistory = async (req, res) => {
    try {
      // Get date range from request query or default to the current month
      const { startDate, endDate } = req.query;
  
      const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const end = endDate ? new Date(endDate) : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
  
      // Fetch all users to create columns for each user
      const users = await User.find({}, 'name').lean();
      const userNames = users.map(user => user.name);
  
      // Fetch all water logs in the specified date range
      const logs = await WaterLog.aggregate([
        {
          $match: {
            date: {
              $gte: start,
              $lte: end
            }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'userDetails'
          }
        },
        { $unwind: '$userDetails' },
        {
          $group: {
            _id: { date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, user: '$userDetails.name' },
            totalJugs: { $sum: '$numberOfJugs' }
          }
        },
        {
          $group: {
            _id: '$_id.date',
            users: {
              $push: {
                user: '$_id.user',
                totalJugs: '$totalJugs'
              }
            }
          }
        },
        { $sort: { _id: 1 } } // Sort by date
      ]);
  
      // Prepare the result in the desired format
      const result = {
        headers: ['Date', ...userNames],
        data: []
      };
  
      // Initialize date-wise data with 0 for each user
      const datesMap = {};
  
      logs.forEach(log => {
        const date = log._id;
        datesMap[date] = { Date: date };
  
        // Set initial count to 0 for all users
        userNames.forEach(userName => {
          datesMap[date][userName] = 0;
        });
  
        // Update count for users who have logged entries on that date
        log.users.forEach(userLog => {
          datesMap[date][userLog.user] = userLog.totalJugs;
        });
      });
  
      // Convert datesMap to an array for the response
      result.data = Object.values(datesMap);
  
      // Send the formatted result
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error });
    }
  };
  
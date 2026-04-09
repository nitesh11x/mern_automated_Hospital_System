import mongoose from "mongoose"

export const connectDb = async () => {
    const uri = process.env.MONGO_URI
    if (!uri) return console.log("uri is missing in env")
    // console.log(uri)
    try {
        await mongoose.connect(uri, { dbName: "mern_Ai_Automated_Hospital_System" });
        console.log('✅ Database connected successfully');
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
    }

}

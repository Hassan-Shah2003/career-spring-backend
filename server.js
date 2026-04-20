import { app } from "./app.js";
import { connectDB } from "./config/db/db.js";
const PORT = process.env.PORT

app.listen(PORT,()=>{
    connectDB();
    console.log(`🚀 Server running on http://localhost:${PORT}`);
})
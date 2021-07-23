import { Server } from "./server.js";
import cors from "cors"; //importing cors module

const server = new Server();

const app = server.setApp();
//app.use(cors()) // if we use cors() like this in app.use() it will allow all cross origin requests to our server, so we add an object with origin key to cors() function specifying the origin from which requests shuld be accepted as shown below:
app.use(
  cors({
    origin: "http://localhost:3000", //This is wh
  })
);

app.listen(process.env.PORT, () => {
  console.log(`server is running at port ${process.env.PORT}`);
});

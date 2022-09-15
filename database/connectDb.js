import { connect } from "mongoose";

export const connectDb = async () => {
  await connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`
  );
};

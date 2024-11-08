import Reactotron, { networking } from "reactotron-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

Reactotron.configure()
  .use(networking()) // <--- here we go!
  .connect();
  
// Reactotron.setAsyncStorageHandler(AsyncStorage)
//   .configure({
//     name: "React Native Demo",
//   })
//   .useReactNative({
//     asyncStorage: false, // there are more options to the async storage.
//     networking: true,
//     editor: false, // there are more options to editor
//     errors: { veto: (stackFrame) => false }, // or turn it off with false
//     overlay: false, // just turning off overlay
//   })
//   .connect();
import Navigation from "./src/components/navigation/Navigation";
import TabBar from "./src/components/navigation/TabBar";
import HistoryOrder from "./src/components/products/screens/HistoryOrder";
import Oder from "./src/components/products/screens/Oder";

const config = {
    screens: {
        tab: {
        path: 'tab',
        screens: {
          Oder: {
            path:'Oder',
          },
          
        },
      },
      TaskDetail: {
        path: 'task-detail/:id',
      },
      HistoryOrder:{
        path:'HistoryOrder'
    }
    },
   
  };
  
  const linking: any = {
    prefixes: ['myapp://app'],
    config,
  };
  
  export default linking;
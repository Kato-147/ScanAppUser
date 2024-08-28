

const config = {
    screens: {
      HistoryOrder:{
        path:'HistoryOrder'
    },
    DetailNews:{
        path:'DetailNews'
    },
    DetailHistoryOrder:{
        path:'DetailHistoryOrder'
    },
    tab:{
        path:'tab'
    },
    
    },
   
  };
  
  const linking: any = {
    prefixes: ['myapp://app'],
    config,
  };
  
  export default linking;
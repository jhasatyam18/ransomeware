import { updateSelectedNodes } from "../reducers/nodeReducer";

export function handleNodeTableSelection(data:any, isSelected:boolean, primaryKey:string) {
    return (dispatch:any, getState:any) => {
    //   if (isSelected) {
    //     if (!selectedSites || selectedSites.length === 0 || !selectedSites[data[primaryKey]]) {
    //     //   const newSites = { ...selectedSites, [data[primaryKey]]: data };
    //       dispatch(updateSelectedSites({data:data,isSelected,primaryKey}));
    //     }
    //   } else if (selectedSites[data[primaryKey]]) {
    //     const newSites = selectedSites;
    //     dispatch(updateSelectedSites({data:data,isSelected,primaryKey}));
    //   }
    dispatch(updateSelectedNodes({data:data,isSelected,primaryKey}))
    };
  }

export {}
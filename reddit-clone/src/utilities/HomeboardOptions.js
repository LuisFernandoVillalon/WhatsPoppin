export const topBoard = ({props}) => {
    let firstTemp = props.masterBoard;
    
    if (firstTemp.sampleBoard) {
        firstTemp = firstTemp.sampleBoard;
    } 
    if (!Array.isArray(firstTemp)) {
       firstTemp = Object.values(firstTemp);
    }
    let temp = [...firstTemp];
    temp.sort((a, b) => {
        return b.voteAmount - a.voteAmount;
    });
    // props.masterBoard.sampleBoard = temp;
    props.setMasterBoard(temp);
}
export const newBoard = ({props}) => {
    let firstTemp = props.masterBoard;
    if (firstTemp.sampleBoard) {
        firstTemp = firstTemp.sampleBoard;
    } 
    if (!Array.isArray(firstTemp)) {
        firstTemp = Object.values(firstTemp);
    }
    let temp = [...firstTemp];
    for (let i = 0; i < firstTemp.length; ++i) {
        if (firstTemp[i].timePosted === undefined) {
            break;
        } else {
            firstTemp[i].timePosted = firstTemp[i].timePosted.split('-').join('');
        }
    }
    temp.sort((a, b) => {
        return b.timePosted - a.timePosted;
    });
    let normal = [];
    let indvNormal = [];
    for (let i = 0; i < temp.length; ++i) {
        if (temp[i].timePosted === undefined) {
            break;
        }
        let tempDateArray = temp[i].timePosted.split('');
        for (let j = 0; j <= tempDateArray.length; ++j) {
            if ( j === 4 || j === 6 )  {
                normal.push("-");
            } else if ( j === 8 ) {
                indvNormal.push([...normal]);
                normal = [];
               break;
            }
            normal.push(tempDateArray[j]);
        }
    }    
    for (let i = 0; i < indvNormal.length; ++i) {
            temp[i].timePosted = indvNormal[i].join('');
    }
    //props.masterBoard.sampleBoard = temp;
    props.setMasterBoard(temp);
}
export const oldBoard = ({props}) => {
    let firstTemp = props.masterBoard;
    if (firstTemp.sampleBoard) {
        firstTemp = firstTemp.sampleBoard;
    } 
    if (!Array.isArray(firstTemp)) {
        firstTemp = Object.values(firstTemp);
    }
    let temp = [...firstTemp];
    for (let i = 0; i < firstTemp.length; ++i) {
        if (firstTemp[i].timePosted === undefined) {
            break;
        } else {
            firstTemp[i].timePosted = firstTemp[i].timePosted.split('-').join('');
        }
    }
    temp.sort((a, b) => {
        return a.timePosted - b.timePosted;
    });
    let normal = [];
    let indvNormal = [];
    for (let i = 0; i < temp.length; ++i) {
        if (temp[i].timePosted === undefined) {
            break;
        }
        let tempDateArray = temp[i].timePosted.split('');
        for (let j = 0; j <= tempDateArray.length; ++j) {
            if ( j === 4 || j === 6 )  {
                normal.push("-");
            } else if ( j === 8 ) {
                indvNormal.push([...normal]);
                normal = [];
               break;
            }
            normal.push(tempDateArray[j]);
        }
    }    
    for (let i = 0; i < indvNormal.length; ++i) {
            temp[i].timePosted = indvNormal[i].join('');
    }
    //props.masterBoard.sampleBoard = temp;
    props.setMasterBoard(temp);
}
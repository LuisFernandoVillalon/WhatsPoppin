const TimePosted = ({currentPost, response}) => {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    let currDate =  [year, month, day].join('-');
    let temp = "";
    if (currentPost === undefined) {
        temp = response.timePost;
    } else if (response === undefined) {
        temp = currentPost.timePosted;
    }
    let postedDate = temp;
    let timePosted = "";

    let currDateArray = currDate.split('');
    let postedDateArray = postedDate.split('');

    let currentDay = [];
    let postedDay = [];
    currentDay.push(currDateArray[8]);
    currentDay.push(currDateArray[9]);
    postedDay.push(postedDateArray[8]);
    postedDay.push(postedDateArray[9]);
    let tempCurrDay = currentDay.join('');
    let tempPostedDay = postedDay.join('');

    let currentMonth = [];
    let postedMonth = [];
    currentMonth.push(currDateArray[5]);
    currentMonth.push(currDateArray[6]);
    postedMonth.push(postedDateArray[5]);
    postedMonth.push(postedDateArray[6]);
    let tempCurrMonth = currentMonth.join('');
    let tempPostedMonth = postedMonth.join('');

    let currentYear = [];
    let postedYear = [];
    currentYear.push(currDateArray[0]);
    currentYear.push(currDateArray[1]);
    currentYear.push(currDateArray[2]);
    currentYear.push(currDateArray[3]);
    postedYear.push(postedDateArray[0]);
    postedYear.push(postedDateArray[1]);
    postedYear.push(postedDateArray[2]);
    postedYear.push(postedDateArray[3]);
    let tempCurrYear = currentYear.join('');
    let tempPostedYear = postedYear.join('');

    let numCurrDay = Number(tempCurrDay);
    let numPostedDay = Number(tempPostedDay);
    let numCurrMonth = Number(tempCurrMonth);
    let numPostedMonth = Number(tempPostedMonth);
    let numCurrYear = Number(tempCurrYear);
    let numPostedYear = Number(tempPostedYear);
    let getMonth = numPostedMonth - numCurrMonth;
    getMonth = Math.abs(getMonth);
    if (numCurrYear === numPostedYear) {
        if (numCurrMonth === numPostedMonth) {
            if (numCurrDay === numPostedDay) {
                timePosted = "today";
            } else if (numPostedDay === numCurrDay - 1) {
                timePosted = "1 day ago";
            } else if (numPostedDay === numCurrDay - 2) {
                timePosted = "2 days ago";
            } else if (numPostedDay === numCurrDay - 3) {
                timePosted = "3 days ago";
            } else if (numPostedDay === numCurrDay - 4) {
                timePosted = "4 days ago";
            } else if (numPostedDay === numCurrDay - 5) {
                timePosted = "5 days ago";
            } else if (numPostedDay === numCurrDay - 6) {
                timePosted = "6 days ago";
            } else  {
                timePosted = "Over a week ago";
            }
        } else {
            if (getMonth === 1) {
                timePosted = getMonth + " month ago";
            } else {
                timePosted = getMonth + " months ago";
            }
        }
    } else if (numPostedYear === numCurrYear - 1) {
        if (numCurrMonth === numPostedMonth) {
            timePosted = "1 year ago";
        } else if (numPostedMonth === numCurrMonth - 1  || numPostedMonth === numCurrMonth + 1 ) {
            timePosted = "11 months ago";
        } else if (numPostedMonth === numCurrMonth - 2  || numPostedMonth === numCurrMonth + 2 ) {
            timePosted = "10 months ago";
        } else if (numPostedMonth === numCurrMonth - 3  || numPostedMonth === numCurrMonth + 3 ) {
            timePosted = "9 months ago";
        } else if (numPostedMonth === numCurrMonth - 4  || numPostedMonth === numCurrMonth + 4 ) {
            timePosted = "8 months ago";
        } else if (numPostedMonth === numCurrMonth - 5  || numPostedMonth === numCurrMonth + 5 ) {
            timePosted = "7 months ago";
        } else if (numPostedMonth === numCurrMonth - 6  || numPostedMonth === numCurrMonth + 6 ) {
            timePosted = "6 months ago";
        } else if (numPostedMonth === numCurrMonth - 7  || numPostedMonth === numCurrMonth + 7 ) {
            timePosted = "5 months ago";
        } else if (numPostedMonth === numCurrMonth - 8  || numPostedMonth === numCurrMonth + 8 ) {
            timePosted = "4 months ago";
        } else if (numPostedMonth === numCurrMonth - 9  || numPostedMonth === numCurrMonth + 9 ) {
            timePosted = "3 months ago";
        } else if (numPostedMonth === numCurrMonth - 10  || numPostedMonth === numCurrMonth + 10 ) {
            timePosted = "2 months ago";
        } else if (numPostedMonth === numCurrMonth - 11  || numPostedMonth === numCurrMonth + 11 ) {
            timePosted = "1 month ago";
        }
    } else if (numPostedYear + 2 <= numCurrYear) {
        timePosted = "over 2 years ago"
    }
    


return (
    <> {timePosted}</>
)
}

export default TimePosted;
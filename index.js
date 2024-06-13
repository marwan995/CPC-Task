let express = require("express");
let app = express();
const sql = require('msnodesqlv8')
let path = require("path");
const cors = require('cors');
const bodyParser = require("body-parser");
let methodOverride = require("method-override");
const connectionString = "server=.;Database=Holidays;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}"

app.use(cors());
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.listen("8000", () => {
    console.log(`launched on port 8000`);
});
app.post("/Request_Holiday", (req, res) => {
    console.log(req.body)
    res.redirect('back')
})
app.get('/empName', (req, res) => {
    let workerId = req.query.workerCode
    let q = "SELECT EmpName FROM employee where employee_id=" + workerId
    sql.query(connectionString, q, (err, rows) => {
        try {
            res.json({ Name: rows[0].EmpName })
        } catch (e) {
            res.json({ Name: "Not found" })
        }
    })
})
app.get('/employeePeriod', (req, res) => {

    let workerId = req.query.workerCode
    let q = "SELECT begin_date,end_date ,employee.EmpName,employee.Hiring_date,employee.Retiring_date   FROM employee_holidays join employee  on (employee.employee_id=employee_holidays.employee_id)where employee.employee_id=" + workerId;
    sql.query(connectionString, q, (err, rows) => {
        let allWorkerHolidays = rows
        let sumOfTimeDiff = 0;
        let TimeToday = new Date().getTime();
        Array.from(allWorkerHolidays).forEach(e => {
            sumOfTimeDiff += e.end_date.getTime() > TimeToday ? 0 : parseFloat(e.end_date.getTime() - e.begin_date.getTime())
        })
        try {
            let Retiring = allWorkerHolidays[0].Retiring_date ? allWorkerHolidays[0].Retiring_date.getTime() : TimeToday;
            console.log(Retiring)
            let totalWorkPeriod = Retiring - (allWorkerHolidays[0].Hiring_date.getTime() + sumOfTimeDiff)
            console.log(totalWorkPeriod)
            res.json({ Name: allWorkerHolidays[0].EmpName, period: formatDateDifference(totalWorkPeriod) })
        } catch (e) {
            res.json({ Name: "Not found", period: "Not found" })
        }
    })

})
function formatDateDifference(timeDiff) {

    // Convert milliseconds to years, months, and days
    const oneYear = 365.25 * 24 * 60 * 60 * 1000; // Approximation for a year
    const oneMonth = 30.4375 * 24 * 60 * 60 * 1000; // Approximation for a month
    const years = Math.floor(timeDiff / oneYear);
    const months = Math.floor((timeDiff % oneYear) / oneMonth);
    const days = Math.floor((timeDiff % oneMonth) / (24 * 60 * 60 * 1000));

    // Construct the formatted string
    let formattedDiff = '';
    if (years > 0) {
        formattedDiff += years + (years === 1 ? ' year' : ' years');
    }
    if (months > 0) {
        if (formattedDiff.length > 0) {
            formattedDiff += ', ';
        }
        formattedDiff += months + (months === 1 ? ' month' : ' months');
    }
    if (days > 0) {
        if (formattedDiff.length > 0) {
            formattedDiff += ', ';
        }
        formattedDiff += days + (days === 1 ? ' day' : ' days');
    }
    return formattedDiff;
}

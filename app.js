
const overlay = document.getElementById('overlay');
const popup = document.getElementsByClassName('popup')[0];
const Request_Holiday = document.getElementsByTagName('li')[0];
const Holidays = document.getElementsByTagName('li')[1];
const Employee_Details = document.getElementsByTagName('li')[2];
const Employment_Period = document.getElementsByTagName('li')[3];
const popUpData = document.getElementById('data')
const form = document.getElementsByTagName('form')[0];

// Function to open the pop-up
function openPopup(heading, inputsNames) {
    overlay.style.display = 'block';
    popup.style.opacity = .9;
    const header = popup.getElementsByTagName('h2')[0];
    header.innerText = heading;
    popUpData.innerHTML = '';
    let counter = 0;
    inputsNames.forEach(i => {
        const input = document.createElement('input');
        popUpData.appendChild(addLabel(counter, i))
        counter++;
        if (i == 'Type Of holiday') {
            createSelect(popUpData)
            return;
        }
        if (i == 'Name')
            input.readOnly = true;



        input.type = i.toLowerCase().includes("date") ? 'date' : 'text';
        input.placeholder = `${i}...`;
        input.name = `${i.replace(/\s/g, "")}`;
        popUpData.appendChild(input);

    });


    if (heading === "Employment_Period") {
        const data = popUpData.getElementsByTagName('input')
        const workerCode = data[0];
        data[2].readOnly = true;
        workerCode.addEventListener('keydown', (e) => {
            if (e.key == 'Enter') {
                axios({
                    method: 'get',
                    url: 'http://localhost:8000/employeePeriod',
                    params: {
                        workerCode: workerCode.value
                    }
                }).then(res => {
                    data[1].value = res.data["Name"]
                    data[2].value = res.data["period"]
                })
            }
        })

        return;
    }
    const button = document.createElement('button');
    button.innerText = 'submit';
    popUpData.appendChild(button);
    if (popUpData.getElementsByTagName('label')[1].innerText != "Name") return;
    let idInput = popUpData.getElementsByTagName('input')[0]
    idInput.addEventListener('change', () => {
        if (idInput.value.length < 1) return;
        axios({
            method: 'get',
            url: 'http://localhost:8000/empName',
            params: {
                workerCode: idInput.value
            }
        }).then(res => {
            popUpData.getElementsByTagName('input')[1].value = res.data["Name"];
        })

    })

}
function addLabel(counter, title) {
    const label = document.createElement('label');
    label.innerText = `${title}`;
    label.classList.add('title')
    label.style.top = `${69 + 56 * counter}px`
    return label;
}
// Function to close the pop-up
function closePopup() {
    overlay.style.display = 'none';
    popup.style.opacity = 0;
}
function createSelect(popUpData) {
    var select = document.createElement("select");
    select.setAttribute("id", "holidayType");

    // Create the option elements
    var options = [
        { value: "paid-vacation", text: "Paid vacation" },
        { value: "sick-leave", text: "Sick leave" },
        { value: "personal-day", text: "Personal day" },
        { value: "family-medical-leave", text: "Family and medical leave" },
        { value: "bereavement-leave", text: "Bereavement leave" },
        { value: "maternity-paternity-leave", text: "Maternity or paternity leave" },
        { value: "parental-leave", text: "Parental leave" },
        { value: "jury-duty-leave", text: "Jury duty leave" },
        { value: "military-leave", text: "Military leave" },
        { value: "sabbatical", text: "Sabbatical or career break" },
        { value: "unpaid-leave", text: "Unpaid leave" },
        { value: "remote-work", text: "Remote work or telecommuting" },
        { value: "flextime", text: "Flextime or flexible working hours" },
        { value: "compensatory-time-off", text: "Compensatory time off" },
        { value: "holiday-time", text: "Holiday time off" }
    ];

    options.forEach(function (optionData) {
        var option = document.createElement("option");
        option.setAttribute("value", optionData.value);
        option.textContent = optionData.text;
        select.appendChild(option);
    });
    popUpData.appendChild(select);
}

// Event listeners for opening and closing the pop-up
overlay.addEventListener('click', closePopup);
Request_Holiday.addEventListener('click', () => { openPopup('Request_Holiday', ['workerCode', 'Name', 'Type Of holiday', 'Holiday start date', 'Holiday end date']) });
Holidays.addEventListener('click', () => { openPopup('Holidays', ['HolidayCode', 'Type']) });
Employee_Details.addEventListener('click', () => { openPopup('Employee_Details', ['workerCode', 'Name', 'Date of hiring', 'Date of Retiring']) });
Employment_Period.addEventListener('click', () => { openPopup('Employment_Period', ['workerCode', 'Name', 'Actual working period']) });

window.addEventListener('keydown', (e) => { if (e.key == 'Escape') closePopup() })
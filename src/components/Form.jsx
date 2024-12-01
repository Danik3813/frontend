import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '../styles/Form.css'
import {ru} from "date-fns/locale";
const Form = () =>{

    //хук useState
    const [burnoutForm, setBurnoutForm] = useState({
        joinDate: '',
        gender: '',
        companyType: '',
        worksFromHome: '',
        workload: '',
        workTime: '',
        fatigueScore: ''
    });

    //установка значений формы
    const handleChange = (event) =>{
        const {name, value} = event.target;
        setBurnoutForm({
            ...burnoutForm,
            [name]: value,
        });
    }

    //получение значений с файла
    const [burnoutResult, setBurnoutResult] = useState(null);

    //отправка формы
    const handleSubmit = async(event) =>{
        event.preventDefault();
        setBurnoutResult(null);
        try{
            const response = await fetch ('http://localhost:8080/api/analyze',{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(burnoutForm)
            });
            
            if (!response.ok){
                throw new Error('Ошибка сети!');
            }

            const burnoutResult = await response.json();
            setBurnoutResult(burnoutResult);
        }
        catch(error){
            console.error(error);
            setBurnoutResult({ error: "Произошла ошибка при отправке данных" });
        }
    }


    return (
        <div className="Form">
            <h1>
                Расчёт вероятности выгорания
                <div className="line"></div>
            </h1>
            <form onSubmit={handleSubmit}>               
                <label>Укажите дату окончания последнего отпуска сотрудника.</label>
                <div className="dataPicker-container">
                    <DatePicker
                        name="joinDate"
                        selected={burnoutForm.joinDate ? new Date(burnoutForm.joinDate) : null}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Выберите дату"
                        onChange={(date) =>
                            setBurnoutForm((prevForm) => ({
                                ...prevForm,
                                joinDate: date ? date.toISOString().split("T")[0] : "",
                            }))
                        }
                        minDate={new Date("2009-01-01")}
                        maxDate={new Date("2023-12-31")}
                        locale={ru}
                        autoComplete="off"
                        required
                    /> 
                </div>
            
                <label> Укажите Ваш пол.</label>
                <span>
                    <input
                        name="gender"
                        type="radio" 
                        value="male"
                        checked={burnoutForm.gender === 'male'}
                        onChange={handleChange}
                        required
                    />
                    Мужской
                </span>
                <span>
                    <input
                        name="gender"
                        type="radio" 
                        value="female"
                        checked={burnoutForm.gender === 'female'}
                        onChange={handleChange}
                        required
                    />
                    Женский
                </span>            
                
                <label>Укажите тип компании сотрудника.</label>
                <span>
                    <input
                        name="companyType"
                        type="radio" 
                        value="product"
                        checked={burnoutForm.companyType === 'product'}
                        onChange={handleChange}
                        required
                    />
                    Производственная работа
                </span>
                <span>
                <input
                        name="companyType"
                        type="radio" 
                        value="service"
                        checked={burnoutForm.companyType === 'service'}
                        onChange={handleChange}
                        required
                    />
                    Сфера услуг
                </span>

                <label>Укажите, есть ли у сотрудника возможность работать удалённо.</label>
                <span>
                    <input
                        type="radio"
                        name="worksFromHome"
                        value="yes"
                        checked={burnoutForm.worksFromHome === 'yes'}
                        onChange={handleChange}
                        required
                    />
                    Да
                </span>
                <span>
                    <input
                        type="radio"
                        name="worksFromHome"
                        value="no"
                        checked={burnoutForm.worksFromHome === 'no'}
                        onChange={handleChange}
                        required
                    />
                    Нет
                </span> 

                <label>
                    Оцените степень рабочей нагрузки сотрудника от 0 до 5
                    <br></br>где 0 - минимальное значение, 5 - максимальное значение.
                </label>
                <input
                    type="number"
                    name="workload"
                    value={burnoutForm.workload}
                    onChange={handleChange}
                    min="0"
                    max="5"
                    step="0.1"
                    placeholder="Введите число"
                    required
                />

                <label>Укажите, сколько часов в день работает сотрудник от 1 до 10.</label>
                <input
                    type="number"
                    name="workTime"
                    value={burnoutForm.workTime}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    placeholder="Введите число"
                    required
                />

                <label>
                    Оцените степень умственной усталости сотрудника от 1 до 10,
                    <br></br>где 0 - минимальное значение, 10 - максимальное значение.
                </label>
                <input
                    type="number"
                    name="fatigueScore"
                    value={burnoutForm.fatigueScore}
                    onChange={handleChange}
                    min="0"
                    max="10"
                    step="0.1"
                    placeholder="Введите число"
                    required
                />
                <button
                    type="submit"
                    id="submitButton"
                >
                    Отправить!
                </button>
            </form>
            {burnoutResult && (
                <div className="burnoutResult">
                    {burnoutResult.error ? (
                        <p className="Error">{burnoutResult.error}</p>
                    ) : (
                        <div>
                            <button
                                className="close"
                                onClick={() => setBurnoutResult(null)}
                            >
                                X
                            </button>
                            <p className="burnRatePercent">Вероятность выгорания:</p>
                            <p>{burnoutResult.burnRatePercent}</p>
                                <p className="recommendations">Ключевые факторы:</p>
                                {burnoutResult.recommendations.split(',').map((item, index) => (
                                    <p key={index}>{item}</p>
                                ))}
                        </div>
                    )}
                </div>
            )}

        </div>
    )
}

export default Form;
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '../styles/Form.css'
import { file } from "@babel/types";
const Form = () =>{

    //хук useState
    const [burnoutForm, setBurnoutForm] = useState({
        restTime: '',
        sex: '',
        companyType: '',
        distanceWork: '',
        workLoad: '',
        workingTime: '',
        mentalFatigueScore: ''
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
        try{
            const response = await fetch ('',{
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
            setResult({ error: "Произошла ошибка при отправке данных" });
        }
    }


    return (
        <div className="Form">
            <h1>Расчёт вероятности выгорания</h1>
            <form onSubmit={handleSubmit}>               
                <label>Укажите дату окончания последнего отпуска сотрудника</label>
                <DatePicker
                    name='restTime'
                    selected={burnoutForm.restTime}
                    dateFormat="yyyy/MM/dd" 
                    placeholderText="Выберите дату"
                    onChange={date => setBurnoutForm({ ...burnoutForm, restTime: date })}
                    required
                />

                <label> Укажите Ваш пол</label>
                <span>
                    <input
                        name="sex"
                        type="radio" 
                        value="male"
                        checked={burnoutForm.sex === 'male'}
                        onChange={handleChange}
                        required
                    />
                    Мужской
                </span>
                <span>
                    <input
                        name="sex"
                        type="radio" 
                        value="female"
                        checked={burnoutForm.sex === 'female'}
                        onChange={handleChange}
                        required
                    />
                    Женский
                </span>            
                
                <label>Укажите тип компании сотрудника</label>
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

                <label>Укажите, есть ли у сотрудника возможность работать удалённо</label>
                <span>
                    <input
                        type="radio"
                        name="distanceWork"
                        value="yes"
                        checked={burnoutForm.distanceWork === 'yes'}
                        onChange={handleChange}
                        required
                    />
                    Да
                </span>
                <span>
                    <input
                        type="radio"
                        name="distanceWork"
                        value="no"
                        checked={burnoutForm.distanceWork === 'no'}
                        onChange={handleChange}
                        required
                    />
                    Нет
                </span> 

                <label>
                    Оцените степень рабочей нагрузки сотрудника от 0 до 5
                    <br></br>где 0 - минимальное значение, 5 - максимальное значение
                </label>
                <input
                    type="number"
                    name="workLoad"
                    value={burnoutForm.workLoad}
                    onChange={handleChange}
                    min="0"
                    max="5"
                    step="0.1"
                    placeholder="Введите число"
                    required
                />

                <label>Укажите, сколько часов в день работает сотрудник от 1 до 10</label>
                <input
                    type="number"
                    name="workingTime"
                    value={burnoutForm.workingTime}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    step="0.1"
                    placeholder="Введите число"
                    required
                />

                <label>
                    Оцените степень умственной усталости сотрудника от 1 до 10,
                    <br></br>где 0 - минимальное значение, 10 - максимальное значение
                </label>
                <input
                    type="number"
                    name="mentalFatigueScore"
                    value={burnoutForm.mentalFatigueScore}
                    onChange={handleChange}
                    min="0"
                    max="10"
                    step="0.1"
                    placeholder="Введите число"
                    required
                />
                <button type="submit">Отправить!</button>
            </form>
            {burnoutResult && (
                <div className="burnoutResult">
                    {burnoutResult.error ? (
                        <p className="Error">{burnoutResult.error}</p>
                    ) : (
                        <div>
                            <p>Вероятность выгорания: {burnoutResult.burnRatePercent}</p>
                            <p>Ключевые факторы: {burnoutResult.reccomendations}</p>
                        </div>
                    )}
                </div>
            )}

        </div>
    )
}

export default Form;
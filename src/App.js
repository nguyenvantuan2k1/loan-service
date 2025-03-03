import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import { formatCurrency } from './utils/NumberUtil';
import { validateNullOrEmpty, validatePhoneNumber } from './utils/Validate';
import { validateRecaptcha } from './utils/api';
function App() {
  const SITE_KEY_V2 = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY_V2 || '';
  // form states
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    loan: "",
    salary: "",
    phoneNumber: ""
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    loan: "",
    salary: "",
    phoneNumber: ""
  });
  const recaptchaRef = useRef < ReCAPTCHA > (null);
  const [showRecaptchaV2, setShowRecaptchaV2] = useState(false);
  const validateForm = useCallback(() => {
    let errors = {
      name: "",
      loan: "",
      salary: "",
      phoneNumber: ""
    };
    const data = formData;
    const notRequiredMsg = "Không được để trống";
    if (!validateNullOrEmpty(data.name)) {
      errors.name = notRequiredMsg;
    }
    if (!validateNullOrEmpty(data.loan)) {
      errors.loan = notRequiredMsg;
    } else if (Number(data.loan) > 300000000000 || Number(data.loan) < 10000000) {
      errors.loan = "vui lòng nhập khoảng vay hợp lệ từ 10 triệu - 3 tỷ";
    }

    if (!validateNullOrEmpty(data.phoneNumber)) {
      errors.phoneNumber = notRequiredMsg;
    }
    if (!validateNullOrEmpty(data.salary)) {
      errors.salary = notRequiredMsg;
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleChange = (e) => {
    const target = e.target;
    const { name, value } = target;

    if (name === "phone") {
      const valid = validatePhoneNumber(value);

      if (!valid) {
        return;
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };
  useEffect(() => {
    if (submitted) {
      validateForm();
    }
  }, [formData, submitted, validateForm]);
  // submit event
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!validateForm()) {
      return;
    }
    try {
      const token = await recaptchaRef.current.getValue();;
      const tokenV3IsValid = await validateRecaptcha({ token });

      if (!tokenV3IsValid) {
        setShowRecaptchaV2(true);
      } else {
        const data = {
          ...formData,
          loan: formatCurrency(formData.loan)
        }
        await axios.post(process.env.REACT_APP_GG_DRIVE, data).then(response => {
          // console.log(response);
          // setName('');
          // setAge('');
          // setLoan('');
          // setSalary('');
        })
      }
    } catch (error) {
      console.error("Error during form submission:", error);
    } finally {
      recaptchaRef.current?.reset();
    }

  }
  const handleRecaptchaV2Change = async (token) => {
    if (!validateForm()) return;

    try {
      const tokenV2IsValid = await validateRecaptcha({ token: token || "", ver: "v2" });
      console.log("reCAPTCHA V2 validation:", tokenV2IsValid);

      if (tokenV2IsValid) {
        await handleSubmit();
      }
    } catch (error) {
      console.error("Error during reCAPTCHA V2 validation:", error);
    } finally {

      recaptchaRef.current?.reset();
    }
  };
  return (
    <div className="container">
      <br />
      <h1>Nhập thông tin để được hỗ trợ</h1>
      <br />
      <form className='form-group'
        onSubmit={handleSubmit}>
        <label>Tên</label>
        <input type='text' className='form-control'
          placeholder='Nhập tên' onChange={handleChange}
          value={formData.name}
          maxLength={50}
          name="name"
        />
        {formErrors?.name && <p className="invalid">{formErrors?.name}</p>}
        <br />
        <label>Số điện thoại</label>
        <input type='number' className='form-control'
          placeholder='Nhập số điện thoại'
          onChange={handleChange}
          value={formData.phoneNumber}
          name="phoneNumber"
        />
        {formErrors?.phoneNumber && <p className="invalid">{formErrors?.phoneNumber}</p>}
        <br />
        <label>Khoảng vay</label>
        <input type='number' className='form-control'
          placeholder='Nhập số tiền muốn vay'
          value={formData.loan}
          onChange={handleChange}
          maxLength={9}
          name="loan"
        />
        {formErrors?.loan && <p className="invalid">{formErrors?.loan}</p>}
        <br />
        <label>Lương</label>
        <input type='text' className='form-control'
          placeholder='Nhập Lương'
          onChange={handleChange}
          value={formData.salary}
          maxLength={50}
          name="salary"
        />
        {formErrors?.salary && <p className="invalid">{formErrors?.salary}</p>}
        <br />
        {showRecaptchaV2 && (
          <ReCAPTCHA
            sitekey={SITE_KEY_V2}
            onChange={handleRecaptchaV2Change}
            ref={recaptchaRef}
          />
        )}
        <br />
        <div style={{ display: "flex", justifyContent: 'flex-end' }}>
          <button type='submit' className='btn btn-primary'>Gửi</button>
        </div>

      </form>
    </div>
  );
}

export default App;
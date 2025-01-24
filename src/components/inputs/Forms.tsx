import { ErrorMessage, Field } from "formik";
import React from "react";

const FormElementInput = () => {
  return (
    <section className="py-12 dark:bg-dark">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <DefaultColumn>
            <DefaultInput label="Default Input" name="defaultInput" value="" />
          </DefaultColumn>

          <DefaultColumn>
            <ActiveInput />
          </DefaultColumn>

          <DefaultColumn>
            <DisabledInput />
          </DefaultColumn>

          {/* <DefaultColumn>
            <NameInput />
          </DefaultColumn> */}

          {/* <DefaultColumn>
            <EmailInput />
          </DefaultColumn> */}

          <DefaultColumn>
            <CompanyNameInput />
          </DefaultColumn>

          <DefaultColumn>
            <CurrencyInput />
          </DefaultColumn>

          <DefaultColumn>
            <InvalidInput />
          </DefaultColumn>

          <DefaultColumn>
            <StrongInput />
          </DefaultColumn>
        </div>
      </div>
    </section>
  );
};

interface IColumnChilren {
  children: any;
}

export default FormElementInput;

export const DefaultColumn = ({ children }: IColumnChilren) => {
  return (
    <div className="w-full px-4 md:w-1/2 lg:w-1/3">
      <div className="mb-12">{children}</div>
    </div>
  );
};

type Props = {
  label: string;
  name: string;
  placeholder?: string;
  id?: string;
  error?: string;
  type?: "text" | "email" | "password" | "date" | "select" | 'number' | 'file';
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string | number | null;
  as?: string,
  accept?: string | null;
};

export const DefaultInput = ({ label, name, placeholder, id, type = "text", as , accept = null }: Props) => {
  return (
    <div>
      <label className="block text-base font-medium text-[#180c5c] mb-2 text-left mt-4" htmlFor={id}>
        {label}
      </label>
      <Field
        as={as}
        id={id}
        name={name}
        placeholder={placeholder}
        type={type}
        accept={accept}
        // onChange={onChange}
        className="w-full bg-transparent rounded-md border border-gray-300 dark:border-gray-700 py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2"
      />
      <ErrorMessage name={name} component="div" className="text-red-500" />
    </div>
  );
};


export const ActiveInput = () => {
  return (
    <>
      <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
        Active Input
      </label>
      <input
        type="text"
        placeholder="Active Input"
        className="w-full bg-transparent rounded-md border border-primary py-[10px] px-5 text-dark-5 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2"
      />
    </>
  );
};

// FormInput.tsx
// import { Field, ErrorMessage } }from 'formik';

interface FormInputProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
}

export const FormInput = ({ name, label, type = "text", placeholder = "" }: FormInputProps) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="mb-[10px] block text-base font-medium text-dark dark:text-white">
        {label}
      </label>
      <Field
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className="w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary"
      />
      <ErrorMessage name={name} component="div" className="text-red-500" />
    </div>
  );
};


export const DisabledInput = () => {
  return (
    <>
      <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
        Disabled Input
      </label>
      <input
        type="text"
        placeholder="Active Input"
        disabled
        className="w-full rounded-md border border-stroke dark:border-dark-3 py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2 dark:disabled:bg-dark-4 dark:disabled:border-dark-4"
      />
    </>
  );
};

// import { Field, ErrorMessage } from 'formik';

interface NameInputProps {
  label: string;
  placeholder: string;
  name: string;
}

export const NameInput = ({ label, placeholder, name }: NameInputProps) => {
  return (
    <div>
      <label className="mb-[10px] block text-base font-medium text-dark dark:text-white" htmlFor={name}>
        {label}
      </label>

      {/* Formik Field Component */}
      <div className="relative">
        <Field
          type="text"
          name={name}
          placeholder={placeholder}
          className="w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 py-[10px] pr-3 pl-12 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
        />
        <span className="absolute top-1/2 left-4 -translate-y-1/2">
          <svg
            width={20}
            height={20}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.334 4.167A.838.838 0 0 0 2.501 5v10c0 .456.377.833.833.833h13.333a.838.838 0 0 0 .834-.833V5a.838.838 0 0 0-.834-.833H3.334ZM.834 5c0-1.377 1.123-2.5 2.5-2.5h13.333c1.377 0 2.5 1.123 2.5 2.5v10c0 1.377-1.123 2.5-2.5 2.5H3.334a2.505 2.505 0 0 1-2.5-2.5V5Z"
              opacity={0.8}
              fillRule="evenodd"
              clipRule="evenodd"
              fill="#9CA3AF"
            />
            <path
              d="M.985 4.522a.833.833 0 0 1 1.16-.205l7.856 5.499 7.855-5.5a.833.833 0 1 1 .956 1.366l-8.333 5.833a.833.833 0 0 1-.956 0L1.19 5.682a.833.833 0 0 1-.205-1.16Z"
            />
          </svg>
        </span>
      </div>

      {/* Formik Error Message */}
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-sm mt-1"
      />
    </div>
  );
};

   

interface EmailInputProps {
  label: string;
  placeholder: string;
  name: string;
}

export const EmailInput = ({ label, placeholder, name }: EmailInputProps) => {
  return (
    <div>
      <label className="mb-[10px] block text-base font-medium text-dark dark:text-white" htmlFor={name}>
        {label}
      </label>

      {/* Formik Field Component */}
      <div className="relative">
        <Field
          type="email"
          name={name}
          placeholder={placeholder}
          className="w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 py-[10px] pr-3 pl-12 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
        />
        <span className="absolute top-1/2 left-4 -translate-y-1/2">
          <svg
            width={20}
            height={20}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity={0.8} fillRule="evenodd" clipRule="evenodd" fill="#9CA3AF">
              <path d="M3.334 4.167A.838.838 0 0 0 2.501 5v10c0 .456.377.833.833.833h13.333a.838.838 0 0 0 .834-.833V5a.838.838 0 0 0-.834-.833H3.334ZM.834 5c0-1.377 1.123-2.5 2.5-2.5h13.333c1.377 0 2.5 1.123 2.5 2.5v10c0 1.377-1.123 2.5-2.5 2.5H3.334a2.505 2.505 0 0 1-2.5-2.5V5Z" />
              <path d="M.985 4.522a.833.833 0 0 1 1.16-.205l7.856 5.499 7.855-5.5a.833.833 0 1 1 .956 1.366l-8.333 5.833a.833.833 0 0 1-.956 0L1.19 5.682a.833.833 0 0 1-.205-1.16Z" />
            </g>
          </svg>
        </span>
      </div>

      {/* Formik Error Message */}
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-sm mt-1"
      />
    </div>
  );
};


export const CompanyNameInput = () => {
  return (
    <>
      <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
        Company Name
      </label>
      <div className="relative">
        <input
          type="text"
          placeholder="Pimjo Labs"
          className="w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 py-[10px] pr-3 pl-12 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
        />
        <span className="absolute top-1/2 left-4 -translate-y-1/2">
          <svg
            width={20}
            height={20}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity={0.8}
              fillRule="evenodd"
              clipRule="evenodd"
              fill="#9CA3AF"
              d="M3.72 12.886a4.167 4.167 0 0 1 2.947-1.22h6.666a4.167 4.167 0 0 1 4.167 4.167v1.666a.833.833 0 1 1-1.667 0v-1.666a2.5 2.5 0 0 0-2.5-2.5H6.667a2.5 2.5 0 0 0-2.5 2.5v1.666a.833.833 0 1 1-1.667 0v-1.666a4.17 4.17 0 0 1 1.22-2.947ZM10 3.333a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm-4.166 2.5a4.167 4.167 0 1 1 8.333 0 4.167 4.167 0 0 1-8.333 0Z"
            />
          </svg>
        </span>
      </div>
    </>
  );
};

export const CurrencyInput = () => {
  return (
    <>
      <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
        Currency
      </label>
      <div className="relative">
        <input
          type="text"
          placeholder="Enter amount"
          className="w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 py-[10px] pr-3 pl-12 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
        />
        <span className="absolute top-1/2 left-4 -translate-y-1/2">
          <svg
            width={20}
            height={20}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity={0.8}
              fillRule="evenodd"
              clipRule="evenodd"
              fill="#9CA3AF"
              d="M3.72 12.886a4.167 4.167 0 0 1 2.947-1.22h6.666a4.167 4.167 0 0 1 4.167 4.167v1.666a.833.833 0 1 1-1.667 0v-1.666a2.5 2.5 0 0 0-2.5-2.5H6.667a2.5 2.5 0 0 0-2.5 2.5v1.666a.833.833 0 1 1-1.667 0v-1.666a4.17 4.17 0 0 1 1.22-2.947ZM10 3.333a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm-4.166 2.5a4.167 4.167 0 1 1 8.333 0 4.167 4.167 0 0 1-8.333 0Z"
            />
          </svg>
        </span>
      </div>
    </>
  );
};

export const InvalidInput = () => {
  return (
    <>
      <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
        Invalid Input
      </label>
      <input
        type="text"
        placeholder="Invalid Input"
        className="w-full bg-transparent rounded-md border border-red-600 py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
      />
    </>
  );
};

export const StrongInput = () => {
  return (
    <>
      <label className="mb-[10px] block text-base font-medium text-dark dark:text-white">
        Strong Input
      </label>
      <input
        type="text"
        placeholder="Strong Input"
        className="w-full bg-transparent rounded-md border border-primary py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
      />
    </>
  );
};

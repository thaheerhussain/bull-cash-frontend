import React from "react";
import CreateWrapper from "@components/Layouts/CreateWrapper";
import RadioButtonGroup from "@atoms/RadioButtonGroup";
import Input from "@atoms/Input";
import { Formik, Form, FormikValues } from "formik";
import * as Yup from "yup";
import Button from "@atoms/Button";
import { ICreatePrivateSale } from "..";
import { usePrivateSaleData } from "src/Contexts/PrivateSaleContext";
import Dropdown from "@atoms/Dropdown";
import CustomCheckbox from "@atoms/CheckBox";
import Input2 from "@atoms/Input2";
import DateTimePicker from "@atoms/DateTimeInput";
import SmallSwitch from "@atoms/CustomSmallSwitch";

const saleMethods = [
  {
    label: "Public",
    name: "sale-methods",
  },
  {
    label: "Whitelist",
    name: "sale-methods",
  },
];

const PrivateSaleCreateStep2: React.FC<ICreatePrivateSale> = (props) => {
  const { formik } = props;

  const {
    values,
    errors,
    setFieldValue,
    handleChange,
    handleBlur,
    touched,
    handleSubmit,
  } = formik;

  return (
    <>
      <form onSubmit={handleSubmit}>
        {/* <p className="text-xs text-[#FF3838] font-normal mb-4">
          (*) is required field.
        </p> */}
        <div className="flex flex-1 flex-col md:flex-row gap-10 mb-4">
          <SmallSwitch
            className="w-full"
            label="Whitelist"
            enabled={values.saleMethod === "Whitelist"}
            setEnabled={(value) => {
              setFieldValue("saleMethod", value ? "Whitelist" : "");
            }}
          />
        </div>
        <div className="mb-6 flex flex-1 flex-col md:flex-row gap-10">
          <p className="text-md font-medium text-bordergraydark">
            Enable a split to automatically divide any funds or royalties earned
            from NFT with up to four recipients, including yourself
          </p>
        </div>
        {/* <div className="mb-6 flex flex-1 flex-col md:flex-row gap-10 md:gap-6 lg:gap-10">
          <div className="md:w-1/2 md:pr-6">
            <Input2
              label={`Presale Rate*`}
              placeholder={`Presale Rate`}
              name="presaleRate"
              type={"number"}
              variant="bright"
              value={values.presaleRate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.presaleRate && errors.presaleRate}
            />
            <p className="text-xs font-normal text-blue1 mt-2">
              1 {values.currency} ={" "}
              {values.presaleRate ? values.presaleRate : "X"} {values.symbol}
            </p>
          </div>
        </div> */}
        <div className="mb-6 flex flex-1 flex-col md:flex-row gap-10 md:gap-6 lg:gap-10">
          <Input2
            label={`Softcap (${values.currency})*`}
            placeholder={"Softcap (BNB)*"}
            name="softcap"
            type={"number"}
            value={values.softcap}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.softcap && errors.softcap}
          />
          <Input2
            label={`Hardcap (${values.currency})*`}
            placeholder={"Hardcap (BNB)*"}
            name="hardcap"
            type={"number"}
            value={values.hardcap}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.hardcap && errors.hardcap}
          />
        </div>
        <div className="mb-6 flex flex-1 flex-col md:flex-row gap-10">
          <Input2
            label={`Minimum Buy (${values.currency})*`}
            placeholder={"Minimum Buy (BNB)*"}
            name="minimumBuy"
            type={"number"}
            value={values.minimumBuy}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.minimumBuy && errors.minimumBuy}
          />
          <Input2
            label={`Maximum Buy (${values.currency})*`}
            placeholder={"Maximum Buy (BNB)*"}
            name="maximumBuy"
            variant="bright"
            type={"number"}
            value={values.maximumBuy}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.maximumBuy && errors.maximumBuy}
          />
        </div>

        {/* {formik.values.saleMethod === "Whitelist" && (
          <>
            <div className="mb-6 flex flex-1 flex-col md:flex-row gap-10">
              <DateTimePicker
                label={`Public Start Time (UTC)*`}
                placeholder={"Select Date"}
                name="publicStartTime"
                value={formik.values.publicStartTime}
                onChange={(v: any) =>
                  formik.setFieldValue("publicStartTime", v)
                }
                onBlur={formik.handleBlur}
                error={
                  formik.touched.publicStartTime &&
                  formik.errors.publicStartTime
                }
              />
              <DateTimePicker
                label={`Tier 1 End Time (UTC)*`}
                placeholder={"Select Date"}
                name="tier1EndTime"
                value={formik.values.tier1EndTime}
                onChange={(v: any) => formik.setFieldValue("tier1EndTime", v)}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.tier1EndTime && formik.errors.tier1EndTime
                }
              />
            </div>
            <div className="mb-6 flex flex-1 flex-col md:flex-row gap-10">
              <DateTimePicker
                label={`Tier 2 End Time (UTC)*`}
                placeholder={"Select Date"}
                name="tier2EndTime"
                value={formik.values.tier2EndTime}
                onChange={(v: any) => formik.setFieldValue("tier2EndTime", v)}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.tier2EndTime && formik.errors.tier2EndTime
                }
              />
            </div>
          </>
        )} */}

        <div className="mb-6 flex flex-1 flex-col md:flex-row gap-10">
          {/* <CustomSwitch
            backGroundClass="bg-[#EB6D65]"
            label="Refund Type"
            options={["Refund", "Burn"]}
            selectedOption={values.refundType}
            setSelectedOption={(v) => {
              setFieldValue("refundType", v);
            }}
          /> */}
          <Input2
            label={`Refund Type`}
            placeholder={"Refund Type"}
            name="refundType"
            type={"text"}
            value={values.refundType}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.refundType && errors.refundType}
          />
          <Input2
            label={`Router (BNB)*`}
            placeholder={"Router (BNB)*"}
            name="router"
            type={"text"}
            value={values.router}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.router && errors.router}
          />
        </div>

        <div className="mb-6 flex flex-1 flex-col md:flex-row gap-10">
          <div className="w-full">
            <Input2
              label={`Liquidity (%)*`}
              placeholder={"Liquidity (%)*"}
              name="liquidity"
              type={"text"}
              value={values.liquidity}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.liquidity && errors.liquidity}
            />
          </div>
          <div className="w-full">
            <Input2
              label={`Listing Rate*`}
              placeholder={"Listing Rate*"}
              name="listingRate"
              type={"number"}
              value={values.listingRate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.listingRate && errors.listingRate}
            />
            {/* <p className="text-xs font-normal text-blue1 mt-2">
              1 {values.currency} ={" "}
              {values.listingRate ? values.listingRate : "X"} {values.symbol}
            </p> */}
          </div>
        </div>

        <div className="mb-6 flex flex-1 flex-col md:flex-row gap-10">
          <DateTimePicker
            label={`Start Time (UTC)*`}
            placeholder={"Select Date"}
            name="startTime"
            value={formik.values.startTime}
            onChange={(v: any) => formik.setFieldValue("startTime", v)}
            onBlur={formik.handleBlur}
            error={formik.touched.startTime && formik.errors.startTime}
          />
          <DateTimePicker
            label={`End Time (UTC)*`}
            placeholder={"Select Date"}
            name="endTime"
            value={formik.values.endTime}
            onChange={(v: any) => formik.setFieldValue("endTime", v)}
            onBlur={formik.handleBlur}
            error={formik.touched.endTime && formik.errors.endTime}
          />
        </div>

        <div className="mb-6 flex flex-1 flex-col md:flex-row gap-10">
          <div className="md:w-1/2 md:pr-6">
            <Input2
              label={`Liquidity Lockup (Days)*`}
              placeholder={"Liquidity Lockup (Days)*"}
              type={"number"}
              name="liquidityLockupDays"
              value={values.liquidityLockupDays}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.liquidityLockupDays && errors.liquidityLockupDays}
            />
            {/* {values.liquidityLockupDays && (
              <p className="text-xs font-normal text-blue1 mt-2">
                {`Liquidity Unlocks at ${
                  values.liquidityLockupDays
                    ? moment(values.endTime)
                        .utc()
                        .add(values.liquidityLockupDays, "days")
                        .format(TIME_FORMAT)
                    : "X date"
                }`}
              </p>
            )} */}
          </div>
        </div>

        <div className="mb-10 flex flex-1 flex-col md:flex-row gap-10">
          <div className="w-full">
            <Input2
              label={`Liquidity Lockup (Days)*`}
              placeholder={"Ex. 0"}
              type={"number"}
              variant="bright"
              // name="liquidityLockupDays"
              // value={values.liquidityLockupDays}
              // onChange={handleChange}
              // onBlur={handleBlur}
              // error={touched.liquidityLockupDays && errors.liquidityLockupDays}
            />
            {/* {values.liquidityLockupDays && (
              <p className="text-xs font-normal text-blue1 mt-2">
                {`Liquidity Unlocks at ${
                  values.liquidityLockupDays
                    ? moment(values.endTime)
                        .utc()
                        .add(values.liquidityLockupDays, "days")
                        .format(TIME_FORMAT)
                    : "X date"
                }`}
              </p>
            )} */}
          </div>
        </div>
        {/* {values.isvesting && (
          <>
            <div className="mb-6 flex flex-1 flex-col md:flex-row gap-10">
              <Input2
                label="TGE percent*"
                placeholder="%"
                type="number"
                name="TGEPercentage"
                onChange={handleChange}
                value={values.TGEPercentage}
                onBlur={handleBlur}
                error={errors.TGEPercentage}
              />
              <div className="w-full">
                <Input2
                  label="Cycle (Days)*"
                  placeholder="Ex. 30"
                  type="number"
                  name="CycleTime"
                  onChange={handleChange}
                  value={values.CycleTime}
                  error={errors.CycleTime}
                />
              </div>
              <Input2
                label="Cycle release percent*"
                placeholder="%"
                type="number"
                name="CycleReleasePercent"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.CycleReleasePercent}
                error={errors.CycleReleasePercent}
              />
            </div>
          </>
        )} */}
      </form>
    </>
  );
};

export default PrivateSaleCreateStep2;

import React, { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import TextArea from "@atoms/TextArea";
import Button from "@atoms/Button";
import CustomSwitch from "@molecules/Switch";
import * as Yup from "yup";
import moment from "moment/moment";
import { useFormik } from "formik";
import Input2 from "@atoms/Input2";
import DateTimePicker from "@atoms/DateTimeInput";
import { DetailsType } from "@components/Details";

interface Props {
  showModal: boolean;
  setShowModal: Function;
  handleSubmit: Function;
  type?: DetailsType;
}

const SetTime: React.FC<Props> = ({
  showModal,
  setShowModal,
  handleSubmit,
  type,
}) => {
  const cancelButtonRef = useRef(null);
  const validations = Yup.object().shape({
    saleMethod: Yup.string().label("Sale method"),
    startTime: Yup.date()
      .nullable()
      .label("Start time")
      .test(
        "startTime",
        "Start time should be 2 minutes in future",
        (value) => {
          return !value || value >= moment.utc().add(2, "m").toDate();
        }
      )
      .test(
        "startTime",
        "Start time should be greater than Tier 1 end time",
        (value, context) => {
          let endTime = context.parent.tier1EndTime;
          if (context.parent.saleMethod === "Public") endTime = 0;
          return !value || endTime < context.parent.startTime;
        }
      )
      .test(
        "startTime",
        "Start time should be greater than Tier 2 end time",
        (value, context) => {
          let endTime = context.parent.tier2EndTime || 0;
          if (context.parent.saleMethod === "Public") endTime = 0;
          return !value || endTime < context.parent.startTime;
        }
      ),
    tier1StartTime: Yup.date()
      .label("Tier 1 start time")
      .test(
        "tier1StartTime",
        "Start time should be 15 minutes in future",
        (value) => !value || value >= moment.utc().add(15, "m").toDate()
      )
      .when("saleMethod", {
        is: "Whitelist",
        then: Yup.date().required("Tier 2 Start Time Required"),
      }),
    tier1EndTime: Yup.date()
      .label("Tier 1 end time")
      .test(
        "tier1EndTime",
        "Tier 1 end time should be greater than start time",
        (value, context) => !value || value > context.parent.tier1StartTime
      )
      .when("saleMethod", {
        is: "Whitelist",
        then: Yup.date().required("Tier 2 End Time Required"),
      }),

    tier2StartTime: Yup.date()
      .nullable()
      .label("Tier 2 start time")
      .test(
        "tier2StartTime",
        "Start time should be greater than Tier 1 end time",
        (value, context) => {
          let endTime = context.parent.tier1EndTime;
          if (context.parent.saleMethod === "Public") endTime = 0;
          return !value || endTime < context.parent.tier2StartTime;
        }
      ),
    tier2EndTime: Yup.date()
      .nullable()
      .label("Tier 2 end time")
      .test(
        "tier2EndTime",
        "Tier 2 end time should be greater than tier 1 start time",
        (value, context) => !value || value > context.parent.tier2StartTime
      )
      .when("tier2StartTime", (tier2StartTime, field) => {
        return tier2StartTime ? field.required() : field;
      }),
  });

  const formik = useFormik({
    initialValues: {
      saleMethod: "Public",
      startTime: "",
      tier1StartTime: "",
      tier1EndTime: "",
      tier2StartTime: "",
      tier2EndTime: "",
    },
    validationSchema: validations,
    onSubmit: async (values, actions) => {
      // handleSubmit(values.)
      if (values.startTime) {
        await handleSubmit(0, moment(values.startTime).unix().toString(), "0");
      }
      if (values.tier1StartTime) {
        await handleSubmit(
          1,
          moment(values.tier1StartTime).unix().toString(),
          moment(values.tier1EndTime).unix().toString()
        );
      }
      if (values.tier2StartTime) {
        await handleSubmit(
          2,
          moment(values.tier2StartTime).unix().toString(),
          moment(values.tier2EndTime).unix().toString()
        );
      }
    },
  });

  const { values, setFieldValue } = formik;

  return (
    <Transition.Root show={showModal} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={() => setShowModal(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            aria-hidden="true"
          />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full justify-center p-4 text-center items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <Dialog.Panel className="relative transform rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 max-w-[600px] w-full">
                <div className="bg-white px-5 sm:px-7 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold leading-6 text-gray-900 text-center">
                      <span className="border-b border-[#000]">
                        Set Pool Time
                      </span>
                    </Dialog.Title>
                  </div>
                </div>
                <div className="w-full mb-5 mt-5 flex px-5 sm:px-7  justify-center">
                  <form onSubmit={formik.handleSubmit}>
                    {(!type || type !== "fairlaunch") && (
                      <div className="mb-6 flex flex-1 flex-col md:flex-row gap-10">
                        <CustomSwitch
                          backGroundClass="bg-[#EB6D65]"
                          label="Sale Method"
                          options={["Public", "Whitelist"]}
                          selectedOption={values.saleMethod}
                          setSelectedOption={(v) => {
                            setFieldValue("saleMethod", v);
                          }}
                        />
                      </div>
                    )}

                    {formik.values.saleMethod === "Whitelist" && (
                      <>
                        <div className="mb-6 flex flex-1 flex-col md:flex-row gap-10">
                          <DateTimePicker
                            label={`Tier 1 Start Time (UTC)*`}
                            placeholder={"Select Date"}
                            name="tier1StartTime"
                            value={formik.values.tier1StartTime}
                            onChange={(v: any) =>
                              formik.setFieldValue("tier1StartTime", v)
                            }
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.tier1StartTime &&
                              formik.errors.tier1StartTime
                            }
                          />
                          <DateTimePicker
                            label={`Tier 1 End Time (UTC)*`}
                            placeholder={"Select Date"}
                            name="tier1EndTime"
                            value={formik.values.tier1EndTime}
                            onChange={(v: any) =>
                              formik.setFieldValue("tier1EndTime", v)
                            }
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.tier1EndTime &&
                              formik.errors.tier1EndTime
                            }
                          />
                        </div>
                        <div className="mb-6 flex flex-1 flex-col md:flex-row gap-10">
                          <DateTimePicker
                            label={`Tier 2 Start Time (UTC)*`}
                            placeholder={"Select Date"}
                            name="tier2StartTime"
                            value={formik.values.tier2StartTime}
                            onChange={(v: any) =>
                              formik.setFieldValue("tier2StartTime", v)
                            }
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.tier2StartTime &&
                              formik.errors.tier2StartTime
                            }
                          />
                          <DateTimePicker
                            label={`Tier 2 End Time (UTC)*`}
                            placeholder={"Select Date"}
                            name="tier2EndTime"
                            value={formik.values.tier2EndTime}
                            onChange={(v: any) =>
                              formik.setFieldValue("tier2EndTime", v)
                            }
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.tier2EndTime &&
                              formik.errors.tier2EndTime
                            }
                          />
                        </div>
                      </>
                    )}

                    <div className="mb-6 flex flex-1 flex-col md:flex-row gap-10">
                      <DateTimePicker
                        label={`Start Time (UTC)*`}
                        placeholder={"Select Date"}
                        name="startTime"
                        value={formik.values.startTime}
                        onChange={(v: any) =>
                          formik.setFieldValue("startTime", v)
                        }
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.startTime && formik.errors.startTime
                        }
                      />
                    </div>
                    <Button
                      loading={formik.isSubmitting}
                      type={"submit"}
                      className="w-full sm:w-56">
                      {" "}
                      Set Time
                    </Button>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default SetTime;

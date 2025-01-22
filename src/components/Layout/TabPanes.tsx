import React, { useState } from "react";
import BaseDashBoard from "../../Layout/BaseDashboard";
import { AcademicGradesTab } from "../AcademicGrades/AcademicGradesTab";
import { PublicationsTab } from "../Publications/PublicationsTab";
import { ProjectsTab } from "../Projects/ProjectsTab";
import { CoursesTab } from "../Courses/CoursesTab";

// Tab Component
const Tab = () => {
    const [open, setOpen] = useState("dashboard");

    // Function to handle tab switching
    const handleTabOpen = (tabCategory: string) => {
        setOpen(tabCategory);
    };

    return (
        <>
            <section className="">
                <div className="container">
                    <div className="w-full">
                        <div className="flex flex-col flex-wrap rounded-lg sm:flex-row">
                            {/* Home Tab */}
                            <a
                                onClick={() => handleTabOpen("dashboard")}
                                className={`cursor-pointer rounded-b-[20px]  hover:ring-4 ring-2 pt-12 pb-4 mx-3 font-medium md:text-base lg:px-6 text-black ${open === "dashboard"
                                    ? " bg-[#180c5c] text-white"
                                    : " hover:bg-[#180c5c] hover:text-white"
                                    }`}
                            >
                                Dashboard
                            </a>

                            <a
                                onClick={() => handleTabOpen("academic-grades")}
                                className={`cursor-pointer rounded-b-[20px] hover:ring-4 ring-2 pt-10 pb-4 mx-1 font-medium md:text-base lg:px-6 text-black ${open === "academic-grades"
                                    ? " bg-[#180c5c] text-white"
                                    : " hover:bg-[#180c5c] hover:text-white"
                                    }`}
                            >
                                Trayectoria Academica
                            </a>

                            {/* Our Team Tab */}
                            <a
                                onClick={() => handleTabOpen("academic-production")}
                                className={`cursor-pointer rounded-b-[20px] hover:ring-4 ring-2 pt-10 pb-4 mx-1 font-medium md:text-base lg:px-6 text-black ${open === "academic-production"
                                    ? " bg-[#180c5c] text-white"
                                    : " hover:bg-[#180c5c] hover:text-white"
                                    }`}
                            >
                                Produccion Academica
                            </a>

                            {/* Our Team Tab */}
                            <a
                                onClick={() => handleTabOpen("user-projects")}
                                className={`cursor-pointer rounded-b-[20px] hover:ring-4 ring-2 pt-10 pb-4 mx-1 font-medium md:text-base lg:px-6 text-black ${open === "user-projects"
                                    ? " bg-[#180c5c] text-white"
                                    : " hover:bg-[#180c5c] hover:text-white"
                                    }`}
                            >
                                Proyectos de Investigacion
                            </a>

                            {/* Company Details Tab */}
                            <a
                                onClick={() => handleTabOpen("courses")}
                                className={`cursor-pointer rounded-b-[20px] hover:ring-4 ring-2 pt-10 pb-4 mx-1 font-medium md:text-base lg:px-6 text-black ${open === "courses"
                                    ? " bg-[#180c5c] text-white"
                                    : " hover:bg-[#180c5c] hover:text-white"
                                    }`}
                            >
                                Cursos Impartidos
                            </a>


                            {/* Company Details Tab */}
                            {/* <a
                    onClick={() => handleTabOpen("company")}
                    className={`cursor-pointer rounded-md px-4 py-3 text-sm font-medium md:text-base lg:px-6 ${
                      open === "company"
                        ? "bg-primary text-white"
                        : "text-body-color hover:bg-red-900 hover:text-white dark:text-dark-6 dark:hover:text-white"
                    }`}
                  >
                    Cursos Impartidos
                  </a> */}


                            {/* Company Details Tab */}
                            {/* <a
                    onClick={() => handleTabOpen("company")}
                    className={`cursor-pointer rounded-md px-4 py-3 text-sm font-medium md:text-base lg:px-6 ${
                      open === "company"
                        ? "bg-primary text-white"
                        : "text-body-color hover:bg-red-900 hover:text-white dark:text-dark-6 dark:hover:text-white"
                    }`}
                  >
                    Participacion en Cogresos
                  </a> */}

                            {/* Company Details Tab */}
                            {/* <a
                //     onClick={() => handleTabOpen("company")}
                //     className={`cursor-pointer rounded-md px-4 py-3 text-sm font-medium md:text-base lg:px-6 ${
                //       open === "company"
                //         ? "bg-primary text-white"
                //         : "text-body-color hover:bg-red-900 hover:text-white dark:text-dark-6 dark:hover:text-white"
                //     }`}
                //   >
                //     Trabajos de Investigacion
                //   </a> */}

                        </div>

                        {/* Tab Content */}
                        <TabContent
                            children={<BaseDashBoard />}
                            // details={'asd'}
                            tabCategory="dashboard"
                            open={open}
                        />
                        <TabContent
                            // details="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia nisi, doloribus nulla cumque molestias corporis eaque harum vero! "
                            tabCategory="academic-grades"
                            children={<AcademicGradesTab />}
                            open={open}
                        />
                        <TabContent
                            children={<PublicationsTab />}
                            // details="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia nisi, doloribus nulla cumque molestias corporis eaque harum vero! Quas sit odit optio debitis nulla quisquam, dolorum quaerat animi iusto quod.
                            // Lorem ipsum dolor, sit amet consectetur adipisicing elit. Suscipit mollitia nam eligendi reprehenderit reiciendis saepe laboriosam maiores voluptas. Quo, culpa amet fugiat ipsam sed quod hic, veritatis ducimus recusandae repellat quasi eaque, suscipit praesentium totam?"
                            tabCategory="academic-production"
                            open={open}
                        />

                        <TabContent
                            children={<ProjectsTab />}
                            // details="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia nisi, doloribus nulla cumque molestias corporis eaque harum vero! Quas sit odit optio debitis nulla quisquam, dolorum quaerat animi iusto quod.
                            // Lorem ipsum dolor, sit amet consectetur adipisicing elit. Suscipit mollitia nam eligendi reprehenderit reiciendis saepe laboriosam maiores voluptas. Quo, culpa amet fugiat ipsam sed quod hic, veritatis ducimus recusandae repellat quasi eaque, suscipit praesentium totam?"
                            tabCategory="user-projects"
                            open={open}
                        />

                        <TabContent
                            children={<CoursesTab />}
                            // details="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia nisi, doloribus nulla cumque molestias corporis eaque harum vero! Quas sit odit optio debitis nulla quisquam, dolorum quaerat animi iusto quod.
                            // Lorem ipsum dolor, sit amet consectetur adipisicing elit. Suscipit mollitia nam eligendi reprehenderit reiciendis saepe laboriosam maiores voluptas. Quo, culpa amet fugiat ipsam sed quod hic, veritatis ducimus recusandae repellat quasi eaque, suscipit praesentium totam?"
                            tabCategory="courses"
                            open={open}
                        />

                    </div>

                </div>
            </section>
        </>
    );
};

export default Tab;

// TabContent Component for rendering content based on the active tab
interface Props {
    open: string;
    tabCategory: string;
    details?: string;
    children?: React.ReactNode
}

export const TabContent = ({ open, tabCategory, details, children }: Props) => {
    return (
        <div>
            <div
                className={`p-6 text-base leading-relaxed text-body-color dark:text-dark-6 ${open === tabCategory ? "block" : "hidden"
                    } `}
            >
                {details}
                <div>
                    {
                        open === tabCategory && children
                    }
                </div>
            </div>
        </div>
    );
};

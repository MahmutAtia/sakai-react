import { motion } from 'framer-motion';
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';

const ModernTemplate = ({ data }) => {
    return (
        <div className="a4-page grid">
            {/* Sidebar */}
            <div className="col-4 bg-primary p-4 text-white">
                <motion.div
                    initial={{ x: -100 }}
                    animate={{ x: 0 }}
                    className="profile-section"
                >
                    <Avatar
                        image={data.personal_information.profiles.avatar || '/default-avatar.png'}
                        className="w-8rem h-8rem border-circle mb-3"
                    />
                    <h2 className="text-2xl font-bold">{data.personal_information.name}</h2>

                    {/* Contact Info */}
                    <div className="contact-info mt-4">
                        <div className="flex align-items-center mb-2">
                            <i className="pi pi-envelope mr-2"></i>
                            {data.personal_information.email}
                        </div>
                        {data.personal_information.phone.map((phone, index) => (
                            <div key={index} className="flex align-items-center mb-2">
                                <i className="pi pi-phone mr-2"></i>
                                {phone}
                            </div>
                        ))}
                    </div>

                    {/* Languages */}
                    <div className="languages-section mt-4">
                        <h3 className="text-xl font-semibold">Languages</h3>
                        {data.languages.map((lang) => (
                            <div key={lang.id} className="mb-2">
                                <strong>{lang.language}</strong>
                                <div className="text-sm">{lang.proficiency}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Main Content */}
            <div className="col-8 p-4">
                {/* Summary */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                >
                    <Card className="mb-4 shadow-4">
                        <h3 className="text-2xl font-bold">Professional Summary</h3>
                        <p>{data.summary}</p>
                    </Card>

                    {/* Experience */}
                    <Card className="mb-4 shadow-4">
                        <h3 className="text-2xl font-bold">Professional Experience</h3>
                        {data.experience.map((exp) => (
                            <div key={exp.id} className="mb-4">
                                <h4 className="text-xl font-semibold">{exp.title}</h4>
                                <h5 className="text-lg text-primary">{exp.company}</h5>
                                <p className="text-500">
                                    {exp.start_date} - {exp.end_date || 'Present'}
                                </p>
                                <ul className="list-none p-0 m-0">
                                    {exp.description.split('\n').map((item, i) => (
                                        <li key={i} className="mb-2">
                                            <i className="pi pi-check mr-2 text-primary"></i>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </Card>

                    {/* Skills */}
                    <Card className="shadow-4">
                        <h3 className="text-2xl font-bold">Skills</h3>
                        <div className="grid">
                            {data.skills.map((skill) => (
                                <div key={skill.id} className="col-6 mb-4">
                                    <h4 className="text-xl font-semibold">{skill.name}</h4>
                                    <ul className="list-none p-0 m-0">
                                        {skill.keywords.map((keyword, i) => (
                                            <li key={i} className="mb-2">
                                                <i className="pi pi-check mr-2 text-primary"></i>
                                                {keyword}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default ModernTemplate;

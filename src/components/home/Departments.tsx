import deptIcon from "../../assets/icons/feature_2.svg";

const Departments = () => {
  return (
    <section
      id="departments"
      className="relative py-20 bg-gradient-to-b from-blue-50 to-white"
    >
      {/* soft background top curve */}
      <div className="absolute top-0 left-0 w-full h-24 bg-blue-100 rounded-b-[80px] -z-10" />

      <div className="max-w-7xl mx-auto px-4">
        {/* TITLE */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Our Departments
          </h2>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <DepartmentCard
            icon={deptIcon}
            title="Better Future"
            desc="Darkness multiply rule which from without life creature blessed give moveth seas."
          />
          <DepartmentCard
            icon={deptIcon}
            title="Medical Care"
            desc="Darkness multiply rule which from without life creature blessed give moveth seas."
          />
          <DepartmentCard
            icon={deptIcon}
            title="Qualified Doctors"
            desc="Darkness multiply rule which from without life creature blessed give moveth seas."
          />
          <DepartmentCard
            icon={deptIcon}
            title="Modern Labs"
            desc="Darkness multiply rule which from without life creature blessed give moveth seas."
          />
        </div>
      </div>
    </section>
  );
};

export default Departments;

/* -------------------------
   Reusable Department Card
--------------------------*/
type DepartmentCardProps = {
  icon: string;
  title: string;
  desc: string;
};

const DepartmentCard = ({ icon, title, desc }: DepartmentCardProps) => {
  return (
    <div className="bg-white rounded-2xl p-8 text-center shadow-md hover:shadow-xl transition">
      <img src={icon} alt={title} className="w-12 mx-auto mb-4" />
      <h4 className="text-lg font-semibold text-gray-800 mb-2">{title}</h4>
      <p className="text-gray-600 text-sm">{desc}</p>
    </div>
  );
};

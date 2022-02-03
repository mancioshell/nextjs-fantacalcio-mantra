const getColor = {
  Por: "warning",
  D: "success",
  Ds: "success",
  Dd: "success",
  Dc: "green",
  E: "primary",
  M: "primary",
  C: "primary",
  W: "violet",
  T: "violet",
  A: "danger",
  Pc: "danger",
};

const roles = ['Por', 'Ds', 'Dd', 'Dc', 'E', 'M', 'C', 'W', 'T', 'A', 'Pc']

function Roles({ roles }) {
  let badgeList = roles.map((role, index) => (
    <span
      key={index}
      className={`badge badge-pill badge-${getColor[role]} mr-1`}
    >
      {role}
    </span>
  ));
  return badgeList;
}

export { Roles, roles };

export default Roles;

export function CameraLogo(props) {
  const col = props.fill;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="3.5rem"
      height="3.5rem"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill={col ? `${col}` : "currentColor"}
        d="m11.2 8.375l3.5-6q2.275.6 4.038 2.2t2.562 3.8zm-2.775 2.5L5 4.875q1.35-1.325 3.138-2.1T12 2q.325 0 .75.038t.775.087zm-6.1 3.625q-.15-.6-.238-1.225T2 12q0-1.775.575-3.35T4.2 5.775L9.25 14.5zm7 7.125q-2.275-.6-4.05-2.2t-2.575-3.8h10.075zM12 22q-.375 0-.763-.05t-.737-.1l5.075-8.725l3.425 6q-1.35 1.325-3.137 2.1T12 22m7.8-3.775L14.75 9.5h6.925q.15.6.238 1.225T22 12q0 1.75-.612 3.35T19.8 18.225"
      ></path>
    </svg>
  );
}

// export function CameraLogo(props) {
//   const col = props.fill;
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width="3rem"
//       height="3rem"
//       viewBox="0 0 24 24"
//       {...props}
//     >
//       <g
//         fill={col ? `${col}` : "none"}
//         stroke="currentColor"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth="1.5"
//         color="currentColor"
//       >
//         <circle cx="12" cy="12" r="10"></circle>
//         <circle cx="12" cy="12" r="4"></circle>
//         <path d="M12 8h9m-5 4v9m-8-9V3m4 13H3"></path>
//       </g>
//     </svg>
//   );
// }

// export function CameraLogo(props) {
//   const col = props.fill;
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width="3rem"
//       height="3rem"
//       viewBox="0 0 24 24"
//       {...props}
//     >
//       <circle cx="12" cy="10" r="3" fill="currentColor"></circle>
//       <path
//         d="M18.125 2H5.875A1.877 1.877 0 0 0 4 3.875v12.25C4 17.159 4.841 18 5.875 18H11v2H7v2h10v-2h-4v-2h5.125A1.877 1.877 0 0 0 20 16.125V3.875A1.877 1.877 0 0 0 18.125 2zM12 15c-2.757 0-5-2.243-5-5s2.243-5 5-5s5 2.243 5 5s-2.243 5-5 5z"
//         fill={col ? `${col}` : "currentColor"}
//       ></path>
//     </svg>
//   );
// }

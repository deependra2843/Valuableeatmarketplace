import React from 'react'

const Prevarrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "flex", background: "white", borderRadius:"50%", justifyContent:"center", alignItems:"center", padding:"5px" }}
        onClick={onClick}
      />
    )
}

export default Prevarrow

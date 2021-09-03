// import React from 'react';
import React, { useEffect, useState } from "react";
import { isUnparsedPrepend } from "typescript";
import { Menu } from 'semantic-ui-react';



export default () => {
  return (
    <Menu style={{ marginTop: '10px', background: 'linear-gradient(293.74deg, #1556D9 22.95%, #1D69FC 93.7%)' }}>
        <img src="./Sikka.png" style={{height: "40px", width:"40px"}} />
        <a className="item">Sikka Coin</a>

      <Menu.Menu position="right">

          <a className="item">Connect</a>

          <a className="item">+</a>
      </Menu.Menu>
    </Menu>
  );
};
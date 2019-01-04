import React from 'react';

const PartyDisplay = props => {
  const partyList =
    props.role === 'none'
      ? ['No active party.']
      : [...props.clients, props.hostID];
  return (
    <aside className="panel party-display">
      <p className="panel-heading">Party Members</p>
      {partyList.map(memberID => {
        let annotation = '';
        if (memberID === props.socketID && memberID === props.hostID) {
          annotation = '(you, host)';
        } else if (memberID === props.socketID) {
          annotation = '(you)';
        } else if (memberID === props.hostID) {
          annotation = '(host)';
        }
        return (
          <p key={memberID} className="panel-block">
            {`${memberID} ${annotation}`}
          </p>
        );
      })}
    </aside>
  );
};

export default PartyDisplay;

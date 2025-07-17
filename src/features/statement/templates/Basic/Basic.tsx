import { moneyToStr } from "../../../../utils/money";
import { StatementData } from "../../types";
import styles from "./Basic.module.css";

export function BasicTemplate({
  events,
  client,
  user,
  userContactInfo,
  amount,
  notes,
}: StatementData) {
  const totalDue = events[events.length - 1]
    ? events[events.length - 1].running_balance
    : 0;

  return (
    <div className={styles.root}>
      <div className={styles.statement}>
        <header className={styles.header}>
          <div className={styles.logo}>
            {user.nameforheader || `${user.fname} ${user.lname}`}
          </div>
          <div className={styles.companyInfo}>
            {userContactInfo.street}
            <br />
            {userContactInfo.city ? (
              <>
                {userContactInfo.city}, {userContactInfo.state}{" "}
                {userContactInfo.zip}
              </>
            ) : null}
            <br />
            {userContactInfo.phone ?? null}
          </div>
        </header>

        <h1 className={styles.title}>Billing Statement</h1>

        <div className={styles.infoGrid}>
          <div className={`${styles.infoBlock}`}>
            <strong>Bill To:</strong>
            <br />
            {`${client.fname} ${client.lname}`}
          </div>
          <div className={`${styles.infoBlock}`}>
            <strong>Statement Date:</strong> {new Date().toDateString()}
            <br />
            {/* <strong>Statement ID:</strong> INV-000123 */}
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr className={styles.thead}>
              <th className={styles.th}>Date</th>
              <th className={styles.th}>Event</th>
              <th className={styles.th}>Amount</th>
              <th className={styles.th}>Balance</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td className={styles.td}>
                  {new Date(event.date).toDateString()}
                </td>
                <td
                  className={
                    styles.td
                  }>{`${event.event_type_title}${event.statement_notes ? ` - ${event.statement_notes}` : `${null}`}`}</td>
                <td className={styles.td}>{moneyToStr(event.amount)}</td>
                <td className={styles.td}>
                  {moneyToStr(event.running_balance)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.total}>
          Grand Total: {amount || moneyToStr(totalDue)}
        </div>

        {notes ? <div>Notes: {notes}</div> : null}

        <footer className={styles.footer}>
          This is a system-generated document. For any questions, please contact
          the sender.
        </footer>
      </div>
    </div>
  );
}

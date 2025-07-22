import { Event } from "@/types/api";
import { moneyToStr } from "../../../../utils/money";
import { StatementData } from "../../types";
import styles from "./Basic.module.css";

export function BasicTemplateCover({
  events,
  client,
  user,
  userContactInfo,
  notes,
  amountDue,
}: StatementData) {
  return (
    <div className={styles.root}>
      <div className={styles.statement}>
        <header className={styles.header}>
          <div className={styles.companyInfo}>
            {user.nameforheader || `${user.fname} ${user.lname}`}
            {user.license ? (
              <>
                <br />
                {user.license}
              </>
            ) : null}
            {userContactInfo.street ? (
              <>
                <br />
                {userContactInfo.street}
              </>
            ) : null}
            {userContactInfo.city ? (
              <>
                <br />
                {userContactInfo.city}, {userContactInfo.state}{" "}
                {userContactInfo.zip}
              </>
            ) : null}
            {userContactInfo.phone ? (
              <>
                <br />
                {userContactInfo.phone}
              </>
            ) : null}
          </div>
        </header>

        <h1 className={styles.title}>Billing Statement</h1>

        <div className={styles.infoGrid}>
          <div className={`${styles.infoBlock}`}>
            <strong>Bill To:</strong>
            <br />
            {`${client.fname} ${client.lname}`}
          </div>
          <div
            className={`${styles.infoBlock}`}
            style={{ textAlign: "center", color: "blue" }}>
            <strong>Amount Due:</strong>
            <br />
            {moneyToStr(amountDue)}
          </div>
          <div className={`${styles.infoBlock}`} style={{ textAlign: "end" }}>
            <strong>Statement Date:</strong> <br />
            {new Date().toLocaleDateString()}
            <br />
            {/* <strong>Statement ID:</strong> INV-000123 */}
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr className={styles.thead}>
              <th className={styles.th}>Date</th>
              <th className={styles.th}>Event</th>
              <th className={styles.th} style={{ textAlign: "right" }}>
                Amount
              </th>
              <th className={styles.th} style={{ textAlign: "right" }}>
                Retainer Balance
              </th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td className={styles.td} style={{ width: ".65in" }}>
                  {new Date(event.date).toLocaleDateString()}
                </td>
                <td className={styles.td} style={{ width: "90mm" }}>
                  <strong>{`${event.event_type_title}`}</strong>
                  {event.statement_notes ? " - " + event.statement_notes : ""}
                </td>
                <td
                  className={styles.td}
                  style={{ width: ".65in", textAlign: "right" }}>
                  {moneyToStr(event.amount)}
                </td>
                <td
                  className={styles.td}
                  style={{ width: "1in", textAlign: "right" }}>
                  {moneyToStr(event.running_balance)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {notes ? <div className={styles.notes}>Notes: {notes}</div> : null}

        <footer className={styles.footer}>
          This is a system-generated document. For any questions, please contact
          the sender.
          <br />
          Made using willowapp.io
        </footer>
      </div>
    </div>
  );
}

export function BasicTemplatePage({ events }: { events: Event[] }) {
  return (
    <div className={styles.root}>
      <div className={styles.statement}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.thead}>
              <th className={styles.th}>Date</th>
              <th className={styles.th}>Event</th>
              <th className={styles.th} style={{ textAlign: "right" }}>
                Amount
              </th>
              <th className={styles.th} style={{ textAlign: "right" }}>
                Balance
              </th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td className={styles.td} style={{ width: "40mm" }}>
                  {new Date(event.date).toDateString()}
                </td>
                <td className={styles.td} style={{ width: "90mm" }}>
                  <strong>{event.event_type_title}</strong>
                  <br />
                  {event.statement_notes ?? ""}
                </td>
                <td className={styles.td} style={{ width: "30mm" }}>
                  {moneyToStr(event.amount)}
                </td>
                <td className={styles.td} style={{ width: "30mm" }}>
                  {moneyToStr(event.running_balance)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <footer className={styles.footer}>
          Continued from previous page
          <br />
          Made using willowapp.io
        </footer>
      </div>
    </div>
  );
}

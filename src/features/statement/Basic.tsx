import {
  Client,
  type Event,
  type User,
  type UserContactInfo,
} from "@/types/api";
import { Table } from "@chakra-ui/react";
import { moneyToStr } from "../../utils/money";
import styles from "./styles/Basic.module.css";

export type StatementData = {
  events: Event[];
  client: Client;
  user: User;
  userContactInfo: UserContactInfo;
  amount?: number;
  notes?: string;
};

export function BasicStatement({
  events,
  client,
  user,
  userContactInfo,
  amount,
  notes,
}: StatementData) {
  console.log(userContactInfo);
  return (
    <div className={styles.container}>
      {/* <!-- header section --> */}
      <div className="container" id="heading">
        <h1 style={{ fontFamily: "sans-serif", fontSize: "36px" }}>
          Account Statement
        </h1>
        <p className={styles["date-section"]}>
          <strong>{new Date().toDateString()}</strong>
        </p>
        <div className={styles["provider-info-section"]}>
          <div className={styles["text-align-end"]} id="providerNameField">
            {user.nameforheader || user.fname + " " + user.lname}
          </div>
          {userContactInfo.street ? (
            <>
              <div className={styles.bullet}>&bull;</div>
              <div className={styles["text-align-center"]}>
                {userContactInfo.street}
              </div>
            </>
          ) : null}
          {userContactInfo.city ? (
            <>
              <div className={styles.bullet}>&bull;</div>
              <div className={styles["text-align-start"]}>
                {userContactInfo.city}, {userContactInfo.state}
              </div>
            </>
          ) : null}
        </div>
        <div className={styles["provider-info-section"]}>
          {userContactInfo.phone ? (
            <>
              <div className="col-auto text-align-end">
                {userContactInfo.phone}
              </div>
              <div className={styles.bullet}>&bull;</div>
            </>
          ) : null}
          {user.license ? (
            <div className="col-auto text-align-start">{user.license}</div>
          ) : null}
        </div>
        <div className={styles["info-section"]}>
          <div
            className={styles["client-info-section"]}
            style={{ textAlign: "start" }}>
            {/* <!-- client section --> */}
            <div style={{ alignSelf: "start" }}>
              <p>
                <strong>Client: </strong>
                {client.fname} {client.lname}
              </p>
            </div>
            <div style={{ alignSelf: "start" }}>
              <p>
                <strong>Balance: </strong>
                {moneyToStr(client.balance)}
              </p>
            </div>
            {amount ? (
              <div className="row">
                <p>
                  <strong>Amount Due: </strong>
                  {moneyToStr(amount)}
                </p>
              </div>
            ) : null}
            {notes ? (
              <div
                style={{ maxWidth: "350px", textAlign: "start" }}
                id="notes-field">
                <p>
                  <strong>Note: </strong>
                  {notes}
                </p>
              </div>
            ) : null}
          </div>
          <div className={styles["info-spacer"]}></div>
          <div
            className={`${styles["client-info-section"]} ${styles["payment-details-section"]}`} style={{ textAlign: 'start'}}>
            <div className="row-1">
              <p>
                <strong>Payment Methods</strong>
              </p>
            </div>
            <div>
              <p>
                <strong>Check: </strong>Mail to address above
              </p>
            </div>
            {userContactInfo.paymentinfo?.paypal ? (
              <div>
                <p>
                  <strong>PayPal: </strong>
                  {userContactInfo.paymentinfo.paypal}
                </p>
              </div>
            ) : null}
            {userContactInfo.paymentinfo?.venmo ? (
              <div>
                <p>
                  <strong>Venmo: </strong>
                  {userContactInfo.paymentinfo.venmo}
                </p>
              </div>
            ) : null}
            {userContactInfo.paymentinfo?.zelle ? (
              <div>
                <p>
                  <strong>Zelle: </strong>
                  {userContactInfo.paymentinfo.zelle}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      {/* <!-- table section --> */}
      <Table.Root width={"100%"} marginY={"24px"}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Date</Table.ColumnHeader>
            <Table.ColumnHeader>Type</Table.ColumnHeader>
            <Table.ColumnHeader>Duration</Table.ColumnHeader>
            <Table.ColumnHeader>Rate</Table.ColumnHeader>
            <Table.ColumnHeader>Amount</Table.ColumnHeader>
            <Table.ColumnHeader>Balance</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {events.map((e) => (
            <Table.Row key={e.id}>
              <Table.Cell>{new Date(e.date).toDateString()}</Table.Cell>
              <Table.Cell>{e.event_type_title}</Table.Cell>
              <Table.Cell>{e.duration}</Table.Cell>
              <Table.Cell>{moneyToStr(e.rate)}</Table.Cell>
              <Table.Cell>{moneyToStr(e.amount)}</Table.Cell>
              <Table.Cell>{moneyToStr(e.running_balance)}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
}

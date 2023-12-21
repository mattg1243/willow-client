import clock from '../../../assets/clock.png';
import money from '../../../assets/money.png';
import bill from '../../../assets/bill.png';

export interface ISubSection {
  image: string;
  heading: string;
  subText: string;
  color?: string;
  bg?: string;
}

const subSections: ISubSection[] = [
  {
    image: clock,
    heading: 'Time Tracking',
    subText:
      'Log events such as meetings, phone calls and emails. Track your billable time, bill rate and the total fees.',
  },
  {
    image: money,
    heading: 'Retainer Management',
    subText: 'Accept and manage retainers. Apply funds to a client account and bill against the balance.',
  },
  {
    image: bill,
    heading: 'Statement Generator',
    subText: 'Prepare and send PDF statements to clients detailing activity by event or date range.',
  },
];

// alternate background and text colors
for (let i = 0; i < subSections.length; i++) {
  if (i % 2) {
    subSections[i].color = 'black';
    subSections[i].bg = 'white';
  } else {
    subSections[i].color = 'white';
    subSections[i].bg = 'var(--primary)';
  }
}

export default subSections;

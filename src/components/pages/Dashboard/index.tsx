interface IProps {
  archiveMode?: boolean;
}

export default function Dashboard(props: IProps) {
  const { archiveMode } = props;
  
  return <h1>Dashboard: archive mode {archiveMode as boolean}</h1>;
}
import { Container, Card } from "react-bootstrap";

const Dashboard = () => {

return (
<Container 
className="mt-5">
<br />
<Card style={{ height: 600 }}>
<iframe
title="estaditicas"
width="100%"
height="100%"
src="https://app.powerbi.com/view?r=eyJrIjoiNWI4ZTQyYWMtYmY5YS00YTdmLTk3ODMtNjBmMzA3MmM3ODgzIiwidCI6ImU0NzY0NmZlLWRhMjctNDUxOC04NDM2LTVmOGIxNThiYTEyNyIsImMiOjR9"
allowFullScreen="true"
></iframe>
</Card>
</Container>
);
};
export default Dashboard ;
import { Paper, Title } from "@mantine/core";
import style from "./pageheader.module.css";

type PageHeaderProps = {
  title: string;
};

const PageHeader = ({ title }: PageHeaderProps) => {
  return (
    <Paper
      shadow="xs"
      p="xs"
      classNames={{
        root: style.paper,
      }}
    >
      <Title order={2} size="1.5rem" fw={600}>
        {title}
      </Title>
    </Paper>
  );
};

export default PageHeader;

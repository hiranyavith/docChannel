function serviceSectionTopic({Topic, Sub_Topic}) {
  return (
    <>
      <h1 className="font-nunito font-bold">{Topic}</h1>
      <p className="font-nunito font-light">
        {Sub_Topic}
      </p>
    </>
  );
}

export default serviceSectionTopic;

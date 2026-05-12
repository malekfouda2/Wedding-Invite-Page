export default function Timeline() {
  const events = [
    { time: "6:00 PM", title: "Ceremony Begins", description: "Witness the exchange of vows" },
    { time: "7:00 PM", title: "Celebration Party", description: "First dance and celebrations" },
    { time: "9:00 PM", title: "Buffet Opens", description: "Enjoy a wonderful feast" },
    { time: "After", title: "Party Continues", description: "Dance the night away" }
  ];

  return (
    <div className="relative border-l border-secondary/30 ml-4 md:ml-0 md:pl-0">
      {events.map((event, i) => (
        <div key={i} className="mb-12 relative pl-8 md:pl-0 md:flex md:items-center md:justify-between group">
          <div className="md:w-5/12 md:text-right md:pr-8">
            <h3 className="text-2xl font-serif text-primary">{event.time}</h3>
          </div>
          
          <div className="absolute left-[-5px] top-1 md:left-1/2 md:-translate-x-1/2 w-3 h-3 rounded-full bg-secondary ring-4 ring-background transition-transform group-hover:scale-150" />
          
          <div className="md:w-5/12 md:pl-8 mt-2 md:mt-0">
            <h4 className="text-xl font-medium text-foreground">{event.title}</h4>
            <p className="text-muted-foreground italic font-serif mt-1">{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

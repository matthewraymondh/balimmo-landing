export default function GroupServices() {
  return (
    <section className="section-pad">
      <div className="container-x">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-16">
          <div className="w-full space-y-6 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
              Balimmo group services
            </h2>
            <p className="text-primary">
              Beyond brokerage: Balimmo also supports you with villa construction, architecture, and
              management services. From vision to reality, we cover the entire journey.
            </p>
          </div>
          <img
            src="/landing/assets/img/other/balimmo-group-services.png"
            alt="Balimmo group services: Properties, Construction and Villa Management"
            width="602"
            height="452"
            loading="lazy"
            decoding="async"
            className="h-auto w-full lg:w-1/2"
          />
        </div>
      </div>
    </section>
  )
}

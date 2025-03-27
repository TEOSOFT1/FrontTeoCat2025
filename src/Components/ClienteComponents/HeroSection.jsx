import { Link } from "react-router-dom"
import { Carousel, Button, Container } from "react-bootstrap"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination, EffectFade } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import "swiper/css/effect-fade"
import "./HeroSection.scss"

const HeroSection = () => {
  // Determinar si es dispositivo móvil
  const isMobile = window.innerWidth < 768

  // Datos para el carrusel
  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1920",
      title: "Todo para tus mascotas en un solo lugar",
      description: "Encuentra alimentos, juguetes, accesorios y más para tus compañeros peludos.",
      buttonText: "Ver Catálogo",
      buttonLink: "/catalogo",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=1920",
      title: "Servicios profesionales para tu mascota",
      description: "Peluquería, baño, paseo y más servicios con personal especializado.",
      buttonText: "Conocer Servicios",
      buttonLink: "/servicios",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=1920",
      title: "Teo/Cat, tu tienda de confianza",
      description: "Más de 5 años cuidando a las mascotas de Medellín con amor y dedicación.",
      buttonText: "Conocer Más",
      buttonLink: "/sobre-nosotros",
    },
  ]

  // Renderizar con Swiper para dispositivos táctiles o Carousel para desktop
  if (isMobile) {
    return (
      <div className="hero-section">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          className="hero-swiper"
          loop={false}
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="hero-slide">
                <img src={slide.image || "/placeholder.svg"} alt={slide.title} className="hero-image" />
                <div className="hero-content">
                  <Container>
                    <div className="hero-text-container">
                      <h1 className="hero-title">{slide.title}</h1>
                      <p className="hero-description">{slide.description}</p>
                      <div className="hero-button-container">
                        <Button
                          as={Link}
                          to={slide.buttonLink}
                          variant="success"
                          size="lg"
                          className="hero-button mt-3"
                        >
                          {slide.buttonText}
                        </Button>
                      </div>
                    </div>
                  </Container>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    )
  }

  return (
    <div className="hero-section">
      <Carousel fade interval={5000} controls={true} indicators={true}>
        {slides.map((slide) => (
          <Carousel.Item key={slide.id}>
            <img src={slide.image || "/placeholder.svg"} className="d-block w-100 hero-image" alt={slide.title} />
            <Carousel.Caption className="text-start hero-content">
              <Container>
                <div className="hero-text-container">
                  <h1 className="hero-title">{slide.title}</h1>
                  <p className="hero-description">{slide.description}</p>
                  <div className="hero-button-container">
                    <Button as={Link} to={slide.buttonLink} variant="success" size="lg" className="hero-button mt-3">
                      {slide.buttonText}
                    </Button>
                  </div>
                </div>
              </Container>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  )
}

export default HeroSection


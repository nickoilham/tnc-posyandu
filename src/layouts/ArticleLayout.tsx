import { SocialMediaBtn } from "@/components/ArticleComponents"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { PropsWithChildren } from "react"
import {FaArrowRight, FaClipboard, FaShareAlt, FaWhatsapp} from 'react-icons/fa'
import { toast } from "react-toastify"

const ArticleLayout= (props: PropsWithChildren<ArticleLayoutData>)=> {
  const {data}= props
  
  function copyToClipboard() {
    navigator.clipboard.writeText(window.location.href)
    
    toast('berhasil copy ke clipboard', {
      type: 'info',
      autoClose: 1500,
      position: 'bottom-center'
    })  
  }


  return (
    <div className="container mx-auto"> 
      <Head>
      <meta property="og:title" content={`Toddler Nutrition Calculator | ${data.title}`} />
        <meta name="description" content={data.title}  />
        <meta property="og:description" content={data.title} />
      </Head> 

      <div className="title space-y-5">
        <h1 className="font-bold text-2xl md:text-4xl">{data.title}</h1>
        <p className="leading-relaxed text-paragraph text-base font-semibold md:w-[90%] xl:w-[70%]">{data.headline}</p>

        <div className="flex flex-row space-x-3">
          <SocialMediaBtn
            className="bg-gray-400"
            title="Copy ke Clipboard"
            Icon={FaClipboard}
            onClick={()=> copyToClipboard()}
          />

          <SocialMediaBtn
            className="bg-green-500"
            title="Bagikan melalui Whatsapp"
            Icon={FaWhatsapp}
            onClick={()=> window.open(`https://wa.me/?text=Cek resep dan artikel untuk balita disini %0a${encodeURIComponent(window.location.href)}`)}
          />
        </div>
      </div>

      <div className="flex flex-col space-y-12 mt-8 lg:space-y-0 lg:flex-row lg:space-x-10">
        <div className="space-y-6 lg:w-[60%]">
          {
            props.data.imageUrl?
            <div className={`w-full relative bg-gray-200 min-h-[250px] md:min-h-[300px] flex justify-center items-center rounded-md`}>
              <Image
                alt={`Foto ${props.data.title}`}
                title={`Foto ${props.data.title}`}
                src={props.data.imageUrl}
                priority={true}
                width={800}
                height={300}
                className="rounded-md w-full object-scale-down"
              />
            </div>
            :
            <div className="h-[300px] w-full bg-gray-400 rounded-md mb-10"></div>
          }
          {props.children}
        </div>

        <div className="space-y-7 right-0 h-fit lg:sticky lg:top-[80px] lg:w-[40%]">
          {
            props.recomendations.map((recomendation, k)=> (
              <div 
                key={k}
                className="space-y-2 border border-gray-200 p-6 rounded-md"
              >
                <Link href={`${props.baseUrl}/${recomendation.title}`}>
                  <h2 className="font-bold text-xl line-clamp-2 duration-500 hover:text-primary-2">{recomendation.title}</h2>
                </Link>
                <p className="line-clamp-2 text-paragraph md:pr-5 ">{recomendation.headline}</p>
                <Link 
                  href={`${props.baseUrl}/${recomendation.title}`}
                  className="flex items-center text-paragraph gap-x-2 duration-500 hover:text-primary-2"
                >
                  Baca Lebih Banyak <FaArrowRight/>
                </Link>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default ArticleLayout

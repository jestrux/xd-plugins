module.exports = /*html*/`
<style>
    *{
        font-family: 'San Francisco', 'Segoe UI', sans-serif;
    }
    h1{
        font-size: 1.25rem;
        font-weight: bold;
        color: #3F3F3F;
        margin: 0;
        letter-spacing: -0.02em;
    }
    h2{
        font-size: 1.05rem;
        font-weight: 600;
        color: #3F3F3F;
        margin: 0;
        letter-spacing: -0.02em;
    }
    input, button{
        margin: 0;
    }
    .w-full{
        width: 100%;
    }
    .block{
        display: block;
    }

    .button{
        display: flex;
        align-items: center;
        justify-content: center;
        height: 24px;
    }
    .button[uxp-variant="action"]{
        width: 24px;
        border-radius: 50%;
        background: #1473E6;
    }
    .button[uxp-variant="action"] svg path{
        fill: #fff;
        width: 20px;
        height: 20px;
    }
    .button[uxp-variant="cta"]{
        width: 100%;
        height: 28px;
        line-height: 28px;
        font-weight: 600;
        font-size: 13px;
        background: #1473E6;
        color: #fff;
        border-radius: 14px;
        margin: 0;
    }
    .button[uxp-variant="cta"].large{
        font-size: 15px;
        height: 36px;
        line-height: 18px;
        border-radius: 20px;
    }
    .bg-white{
        background: white;
    }
    .bg-black{
        background: black;
    }
    .bg-black26{
        background: rgba(0, 0, 0, 0.05);
    }
    .bg-light-gray{
        background: #f0f0f0;
    }
    .bg-gray{
        background: #e8e8e8;
    }
    .bg-dark-gray{
        background: #888;
    }
    .text-white{
        color: white;
    }
    .text-black{
        color: black;
    }
    .text-sm{
        font-size: 0.65rem;
        line-height: 1.5;
    }
    .text-md{
        font-size: 0.85rem;
        line-height: 1.5;
    }
    .text-lg{
        font-size: 1rem;
    }
    .text-xl{
        font-size: 1.25rem;
    }
    .text-center {
        text-align: center;
    }
    .flex{
        display: flex;
    }
    .inline-flex{
        display: inline-flex;
    }
    .center-center,
    .items-center{
        align-items: center;
    }
    .center-center,
    .justify-center{
        justify-content: center;
    }
    .flex-1{
        flex: 1;
    }
    .relative{
        position: relative;
    }
    .absolute{
        position: absolute;
    }
    .inset-0{
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
    }
    .z-10{
        z-index: 10;
    }
    .p-0{
        padding: 0;
    }
    .p-1{
        padding: 0.25rem;
    }
    .p-2{
        padding: 0.5rem;
    }
    .p-3{
        padding: 0.75rem;
    }
    .px-0{
        padding-left: 0;
        padding-right: 0;
    }
    .px-1{
        padding-left: 0.25rem;
        padding-right: 0.25rem;
    }
    .px-2{
        padding-left: 0.5rem;
        padding-right: 0.5rem;
    }
    .px-3{
        padding-left: 0.75rem;
        padding-right: 0.75rem;
    }
    .py-0{
        padding-top: 0;
        padding-bottom: 0;
    }
    .py-1{
        padding-top: 0.25rem;
        padding-bottom: 0.25rem;
    }
    .py-2{
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
    }
    .py-3{
        padding-top: 0.75rem;
        padding-bottom: 0.75rem;
    }
    .m-auto{
        margin: auto;
    }
    .m-0{
        margin: 0;
    }
    .mx-0{
        margin-left: 0;
        margin-right: 0;
    }
    .mt-0{
        margin-top: 0;
    }
    .mt-1{
        margin-top: 0.25rem;
    }
    .mt-2{
        margin-top: 0.5rem;
    }
    .mt-3{
        margin-top: 0.75rem;
    }
    .mb-1{
        margin-bottom: 0.25rem;
    }
    .mb-2{
        margin-bottom: 0.5rem;
    }
    .mb-3{
        margin-bottom: 0.75rem;
    }
    .ml-1{
        margin-left: 0.25rem;
    }
    .ml-2{
        margin-left: 0.5rem;
    }
    .ml-3{
        margin-left: 0.75rem;
    }
    .mr-1{
        margin-right: 0.25rem;
    }
    .mr-2{
        margin-right: 0.5rem;
    }
    .mr-3{
        margin-right: 0.75rem;
    }
    .opacity-65{
        opacity: 0.65;
    }
    .border,
    .border-2{
        border: 1px solid #ddd;
    }
    .border-2{
        border-width: 2px;
    }
    .border-black{
        border-color: black;
    }
    .border-dark-gray{
        border-color: #888;
    }
    .rounded-full{
        border-radius: 50%;
    }
    .rounded{
        border-radius: 12px;
    }
    .rounded-sm{
        border-radius: 6px;
    }
    .rounded-xs{
        border-radius: 3px;
    }
</style>
`;
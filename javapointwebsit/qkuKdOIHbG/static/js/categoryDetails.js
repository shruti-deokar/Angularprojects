let folderName = generateUUID();
let fileName = generateUUID();
let fileDelete = false;
let Compiler_Info = {};  // an object to store compiler id,with it's respective filename/classname {compiler_id - classname}
let compilerToggledState = {}; // Object to store the toggled state for each compiler
let currentlyOpenMegaMenu = null;
const map1 = new Map();
$(document).ready(function () {

    (function () {   //Changing position of previous and next button
        const $links = $('#bottomnextup a');
        $links.eq(0).insertAfter($links.eq(1));
    })();

    const imageData = document.querySelectorAll('img');
    if (imageData.length > 0) {
        imageData.forEach((img) => {
            const s3_bucket_url = 'https://d2jdgazzki9vjm.cloudfront.net'
            let base_url = img.src.includes('static.javatpoint.com') ? 'https://static.javatpoint.com' : window.location.origin;
            img.src = img.src.replace(base_url, s3_bucket_url);
        });
    }

    $('#compiler_modal').on('hidden.bs.modal', function (e) {
        if (e.type === 'hidden') {
            $("#result_java").css("display", "block");
            $("#result_html").css("display", "none");
            $("#filename_input").val();
            $("#compiler_textarea").text(" ");
            $("#result_java").text("");
            $("#folder_input").val("");
            folderName = '';
        }
    })
    // Function to toggle the visibility of the scroll button
    function toggleScrollButton() {
        let scrollButton = document.getElementById("scrollButton");
        if (window.scrollY > window.innerHeight / 2) {
            scrollButton.style.display = "block";
        } else {
            scrollButton.style.display = "none";
        }
    }
    // scroll event listener to the window
    window.addEventListener("scroll", toggleScrollButton);

    if (window.innerWidth <= 895) {
        const compilerElements = document.querySelectorAll('[id^="compiler_textarea_"]');
        const resultElements = document.querySelectorAll('[id^="result_java_"]');
        const toggleButtons = document.querySelectorAll('[id^="toggle_button_"]');
        const copyButtons = document.querySelectorAll('[id^="Copy_Code_"]');
        const downloadButtons = document.querySelectorAll('[id^="download_Code"]');
        const n = resultElements.length;
        for (let i = 0; i < n; i++) {
            compilerElements[i].style.display = "block";
            compilerElements[i].style.width = "100%";
            compilerElements[i].style.height = "250px";
            resultElements[i].style.display = "block";
            resultElements[i].style.marginTop = "2.5px";
            resultElements[i].style.height = "250px";
            compilerElements[i].parentNode.insertBefore(resultElements[i], compilerElements[i].nextSibling.nextSibling.nextSibling);
            toggleButtons[i].remove();
            copyButtons[i].style.marginRight = "2.8rem";
            downloadButtons[i].style.marginRight = "6rem";
        }
        document.getElementById('search-icon').addEventListener('click', function () {
            const gcseSearch = document.getElementById('___gcse_0');
            const navbar = document.getElementsByClassName("jtp-nav")[0];
            const icon = document.getElementsByClassName("fa fa-search")[0];
            const closeBtn = document.getElementById('close-btn');
            if (gcseSearch.style.display === 'none' || gcseSearch.style.display === '') {
                gcseSearch.style.display = 'block';
                gcseSearch.style.width = '100%'; // Adjust width to fit available space
                navbar.style.display = 'none';
                icon.style.display = 'none';
                closeBtn.style.display = 'block';
            }
        });

        document.getElementById('close-icon').addEventListener('click', function () {
            const gcseSearch = document.getElementById('___gcse_0');
            const navbar = document.getElementsByClassName("jtp-nav")[0];
            const icon = document.getElementsByClassName("fa fa-search")[0];
            const closeBtn = document.getElementById('close-btn');
            if (gcseSearch.style.display !== 'none') {
                gcseSearch.style.display = 'none';
                navbar.style.display = 'block';
                icon.style.display = 'block';
                closeBtn.style.display = 'none';
            }
        });
    }
    const navLinks = document.querySelectorAll('.nav-link.dropdown-toggle');
    navLinks.forEach((link, index) => {
        link.addEventListener('click', () => {
          const megaMenu = link.nextElementSibling;
          map1.set(megaMenu?.id, true);
          if (megaMenu.classList.contains('show')) {
            map1.delete(megaMenu?.id);
          }
          if (map1.size === 2) {
            const keys = Array.from(map1.keys());
            const keyToDelete = keys.find(key => key !== currentlyOpenMegaMenu?.id);
            map1.delete(keyToDelete);
            megaMenu_close(keyToDelete);
          }
          const ariaExpanded = link.getAttribute('aria-expanded');
          link.parentElement.style.backgroundColor = ariaExpanded === 'true' ? '' : '#0d4549';
        });
    });

});
$(window).on('beforeunload', function () {
    const fileName = $("#filename_input").val()
    $("#result_java").css("display", "block");
    $("#result_html").css("display", "none");
    $("#filename_input").val();
    $("#compiler_textarea_").val("");
    $("#result_java").text("");
    $("#folder_input").val("");
    folderName = '';
});

const compileCode = (lang, text, fileeName, Compiler) => {
    fileDelete = true;
    $(".compile_code").prop('disabled', true).css('opacity', 0.5);

    if (lang === 'xml') {
        if (folderName === '') {
            folderName = generateUUID();
        }
        $("#folder_input").val(folderName);
        $.ajax({
            type: 'POST',
            url: '/compiler/xml',
            cache: false,
            crossDomain: true,
            data: { code: text },
            success: function (result) {
                const message = JSON.parse(result);
                if (message.error) {
                    $("#result_java_" + Compiler).text(message.error);
                    $(".compile_code").prop('disabled', false).css('opacity', 1);
                }
                else {
                    $("#result_java_" + Compiler).text(JSON.stringify(JSON.parse(message.output), null, 2));
                    $("#filename_input").val(message.filename + '.java');
                    $(".compile_code").prop('disabled', false).css('opacity', 1);
                }
            },
            error: function (error) {
                $(".compile_code").prop('disabled', false).css('opacity', 1);
                console.log("error", error)
            }
        });
    }
    else if (lang === 'html' || lang === 'javascript') {
        let container = $("#result_java_" + Compiler); // Check if there's an iframe inside the container
        let existingIframe = container.find("iframe");
        if (existingIframe.length > 0) {
            existingIframe.remove(); // If already an iframe exists,then removing it
        }
        let iframe = document.createElement('iframe'); // Create a new iframe element
        iframe.srcdoc = text; // Set the source of the iframe to execute your code
        iframe.style.height = '95%'; // Add a style attribute to set the height of the iframe to 15 rem
        iframe.style.width = '96%';
        iframe.style.position = 'absolute';
        iframe.style.top = '2px';
        container = $("#result_java_" + Compiler);// Append the iframe to a container element,
        container.append(iframe);
        $(".compile_code").prop('disabled', false).css('opacity', 1);
    }
    else if (lang === 'java') {
        if (folderName === '') {
            folderName = generateUUID();
        }
        text = text.replace(new RegExp(fileeName, 'g'), 'Main');
        $("#folder_input").val(folderName);
        $.ajax({
            type: "POST",
            url: "/compileCode",
            cache: false,
            crossDomain: true,
            data: { language_id: 62, source_code: text },
            success: function (result) {
                if (result?.status?.description !== 'Accepted') {
                    $("#result_java_" + Compiler).text(result.status.description + '\n' + result?.compile_output);
                    $(".compile_code").prop('disabled', false).css('opacity', 1);
                }
                else {
                    result.stdout = result.stdout.replace(new RegExp('Main', 'g'), fileeName);
                    $("#result_java_" + Compiler).text(result.stdout);
                    $(".compile_code").prop('disabled', false).css('opacity', 1);
                }
            },
            error: function (error) {
                $(".compile_code").prop('disabled', false).css('opacity', 1);
                console.log("error", error)
            }
        });
    }
    else if (lang === 'python' || lang === 'c++' || lang === 'c') {
        if (folderName === '') {
            folderName = generateUUID();
        }
        const languageMapping = {
            'c++': 54,
            'python': 71,
            'c': 50,
        };
        $("#folder_input").val(folderName);
        $.ajax({
            type: "POST",
            url: "/compileCode",
            cache: false,
            crossDomain: true,
            data: { language_id: languageMapping[lang], source_code: text },
            success: function (result) {
                const statusDescription = result?.status?.description ?? 'Syntax Error !!!';
                const compileOutput = result?.compile_output ?? 'Please check your Code';
                const outputText = result?.status?.description !== 'Accepted' ? `${statusDescription}\n${compileOutput}` : result.stdout;
                $("#result_java_" + Compiler).text(outputText);
                $(".compile_code").prop('disabled', false).css('opacity', 1);
            },
            error: function (error) {
                $(".compile_code").prop('disabled', false).css('opacity', 1);
                console.log("error", error);
            }
        });
    }


}

function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if (d > 0) {//Use timestamp until depleted
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

function CreateTextFile(code, fileName) {
    var blob = new Blob([code], {
        type: "text/plain;charset=utf-8",
    });
    saveAs(blob, fileName);
}

const openCompiler = (lang, text, fileName, Compiler) => {
    $("#result_html").css("display", "none");
    $("#compiler_textarea_" + Compiler).val(text);
    $("#lang_input").val(lang)
    $("#filename_input").val(fileName)
    Compile(Compiler);
}

function Compile(Compiler) {
    const filename = (typeof Compiler_Info === 'object' && Compiler_Info.hasOwnProperty(Compiler)) ? Compiler_Info[Compiler] : 'file';
    const url = window.location.href;
    const langInput = $("#lang_input");
    const compilerTextarea = $("#compiler_textarea_" + Compiler);

    if (/html|javascript|css|bootstrap|jquery/.test(url)) {
        langInput.val("javascript");
    }
    compileCode(langInput.val(), compilerTextarea.val(), filename, Compiler);
}

function Close_Compiler(compilerId) {   //Closing the Compiler on Close Button
    const compilerElement = document.getElementById(`compiler_${compilerId}`);
    compilerElement.parentElement.hidden = true;
}
function Toggle_Compiler(compilerId) {
    let compilerElement = document.getElementById(`compiler_textarea_${compilerId}`);
    let resultElement = document.getElementById(`result_java_${compilerId}`);

    if (compilerToggledState[compilerId] === undefined) { // Initialize the toggled state for this compiler if it's not already in the object
        compilerToggledState[compilerId] = false;
    }
    if (compilerToggledState[compilerId] === false) {
        // Set the display property of both elements to "block" to ensure they are stacked vertically
        compilerElement.style.display = "block";
        resultElement.style.display = "block";

        compilerElement.parentNode.insertBefore(resultElement, compilerElement.nextSibling.nextSibling.nextSibling); // Append the resultElement after the compilerElement in the DOM
        resultElement.style.marginTop = "2.5px"; // Set margin to create space below the resultElement
        resultElement.style.height = "250px";
        compilerElement.style.width = "100%";
        compilerElement.style.height = "250px";
        compilerToggledState[compilerId] = true;
    }
    else {
        compilerElement.style.display = "";
        resultElement.style.display = "";
        compilerElement.parentNode.removeChild(resultElement);
        compilerElement.parentNode.parentNode.appendChild(resultElement);
        resultElement.style.marginTop = "";
        resultElement.style.height = "";
        compilerElement.style.width = "";
        compilerElement.style.height = "";
        compilerToggledState[compilerId] = false;
    }
}
function Copy_Code(compilerId) {
    let copyText = $("#compiler_textarea_" + compilerId).val();
    navigator.clipboard.writeText(copyText) // Copy the text to the clipboard
        .then(function () {
            let buttonElement = document.getElementById(`Copy_Code_${compilerId}`); // Text copied successfully, update the tooltip title
            buttonElement.setAttribute("title", "Text-Copied");
            $(buttonElement).tooltip('dispose').tooltip();// Initialize the Bootstrap tooltip for the updated title
        })
        .catch(function (err) {
            console.error('Failed to copy text: ', err);
        });
}
function download_Code(compilerId, fileName = 'code') {
    const downloadText = $("#compiler_textarea_" + compilerId).val();
    const blob = new Blob([downloadText], { type: 'text/plain' }); // Create a blob from the text content 
    const url = window.URL.createObjectURL(blob); // Create a temporary URL for the blob   
    const a = document.createElement('a'); // Create an anchor element to trigger the download
    a.href = url;
    a.download = fileName; // Use the passed fileName as the download name    
    a.click(); // Simulate a click event to trigger the download
    window.URL.revokeObjectURL(url); // Release the blob and URL
}

function contains(selector, text) {
    var elements = document.querySelectorAll(selector);
    return Array.prototype.filter.call(elements, function (element) {
        element.addEventListener('click', function () {
            newElement.hidden = false; // Toggle the visibility
            const text = $(this).parent().prev().children('textarea')[0] || $(this).parent().prev().prev().children('textarea')[0] || $(this).parent().prev().children()[1];
            let fileName;
            for (const compilerId in Compiler_Info) {
                if (text.innerText.includes(Compiler_Info[compilerId])) {
                    fileName = Compiler_Info[compilerId];
                }
            }
            openCompiler(text.className, text.innerText, fileName, Compiler);
        });
        element.target = "";
        let href = element.href;
        let url = new URL(href);
        let fileNameFromHref = url.searchParams.get('filename');
        element.href = 'javascript:void(0)';
        element.type = 'button';
        element.className = 'btn btn-outline-info custom-btn-color shadow-none';  //Adding Bootstrap class     
        element.style.marginBottom = "10px";
        element.style.borderRadius = '5px';
        let Compiler = generateUUID();  //Generating Uid for every compiler to differentiate
        Compiler_Info[Compiler] = fileNameFromHref;;
        let newElement = document.createElement('div'); //Making a new Compiler below, "Test it Now"
        newElement.hidden = true;
        newElement.innerHTML = `
        <div id="compiler_${Compiler}" class="Compiler_class" role="dialog">
            <div class="dialog">
                <div class="content">
                    <div class="head-content">
                        <div class="header">
                            <h4 class="title">Compiler</h4>
                        </div>
                        <div class="button">
                            <button type="button" class="border border-dark border-2" id="download_Code_${Compiler}" title="download_code" style="float:right;margin-top:-2.8rem;margin-right:9rem;background-color:white" onClick="download_Code('${Compiler}', '${fileNameFromHref}')"><img src="https://static.vecteezy.com/system/resources/previews/000/574/204/original/vector-sign-of-download-icon.jpg" width="20px" height="20px"></button>
                            <button type="button" class="border border-dark border-2" id="Copy_Code_${Compiler}" data-toggle="tooltip" data-placement="top" title="Copy to Cipboard" style="float:right;margin-top:-2.8rem;margin-right:5.8rem;background-color:white" onClick="Copy_Code('${Compiler}')" ><img src="https://static.thenounproject.com/png/5418785-200.png" width="20px" height="20px"></button>
                            <button type="button" class="border border-dark border-2" id="toggle_button_${Compiler}"  style="float:right;margin-top:-2.8rem;margin-right:2.8rem;background-color:white" onClick="Toggle_Compiler('${Compiler}')"><img src="https://static.thenounproject.com/png/3293059-200.png" width="20px" height="20px"></button>
                            <button type="button" class="btn-close border border-dark border-2" aria-label="Close" btn-close-color:"black" style="float:right;opacity:1.5; margin-top:-2.8rem;border-radius:0;background-color:white;padding:0.75em 0.75em;font-size:72%;" onClick="Close_Compiler('${Compiler}')"></button>
                        </div>
                    </div>
                    <div class="body">
                        <input type="hidden" id="lang_input">
                        <input type="hidden" id="folder_input">
                        <input type="hidden" id="filename_input">
                        <div class="compiler" style="position:relative;">
                        <div class="program" style="width: 100%;height: 100%;position: relative;">
                            <textarea id="compiler_textarea_${Compiler}" placeholder="write your code ......."></textarea>
                            <button type="button" id="compile_code" class="compile_code btn btn-info custom-btn-color shadow-none" onClick="Compile('${Compiler}')">Run</button>
                        </div>
                            <div class="compile_result" id="result_java_${Compiler}">
                            
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
        newElement.style.marginTop = "10px"; // Adjust the top margin value as needed
        element.parentNode.insertBefore(newElement, element.nextSibling);
    });
}

contains('.testit > a');

const showhide = (id) => {
    const $answer = $("#answer" + id);
    const $btntext = $("#btntext" + id);
    $btntext.parent().css("background-image", 'url(https://javatpoint-images.s3.eu-north-1.amazonaws.com/images/eye-black.png)');
    if ($answer.css("display") === 'block') {
        $answer.css("display", "none");
        $btntext.text('Show Answer');
    } else {
        $answer.css("display", "block");
        $btntext.empty();
        $btntext.parent().css("background-image", 'url(https://javatpoint-images.s3.eu-north-1.amazonaws.com/images/eye-close-black.png)');
        $btntext.append('Hide Answer');
    }
}

const codeblocks = document.querySelectorAll(".codeblock");
if (window.location.href.includes('cpp')  || (window.location.pathname.startsWith('/c-') && !window.location.pathname.includes('sharp')) || window.location.href.endsWith('-c')) {  //Adding Button Dynamically in C and C++ Pages
    for (let i = 0; i < codeblocks.length; i++) {
        const codeblock = codeblocks[i];
        const nextElement = codeblock.nextElementSibling;  // Check if the next element is a <span class="testit">
        if (!nextElement || !nextElement.classList.contains("testit")) {
            const code = codeblock.querySelector('textarea').innerHTML;
            if (/pip|install|import|…………………|open/.test(code)) {
                continue;
            }
            const button = document.createElement("button");
            button.textContent = "Test it Now"; // Set the button text
            button.className = 'btn btn-outline-info custom-btn-color shadow-none'; // Add Bootstrap classes
            button.style.marginBottom = "10px"; // Add margin style
            button.type = 'button';
            // Add an onclick event handler to toggle the 'hidden' property of the newElement
            button.onclick = function () {
                let newElement = this.nextElementSibling; // Get the next element (newElement)
                newElement.hidden = false; // Toggle the 'hidden' property
                const text = codeblock.querySelector('textarea').innerText;
                const lang = window.location.href.includes('python') ? 'python' : window.location.href.includes('cpp') ? 'c++' : window.location.href.includes('c') ? 'c' : '';
                $("#compiler_textarea_" + Compiler).val(text);
                $("#lang_input").val(lang);
                $("#filename_input").val(fileName);
            };
            codeblock.insertAdjacentElement("afterend", button);
            let Compiler = generateUUID();  //Generating Uid for every compiler to differentiate  
            let newElement = document.createElement('div'); // Insert the new element below the button
            newElement.hidden = true;
            newElement.innerHTML = `
          <div id="compiler_${Compiler}" class="Compiler_class" role="dialog">
          <div class="dialog">
              <div class="content">
                  <div class="head-content">
                      <div class="header">
                          <h4 class="title">Compiler</h4>
                      </div>
                      <div class="button">
                          <button type="button" class="border border-dark border-2" id="download_Code_${Compiler}" title="download_code" style="float:right;margin-top:-2.8rem;margin-right:9rem;background-color:white" onClick="download_Code('${Compiler}')" ><img src="https://static.vecteezy.com/system/resources/previews/000/574/204/original/vector-sign-of-download-icon.jpg" width="20px" height="20px"></button>
                          <button type="button" class="border border-dark border-2" id="Copy_Code_${Compiler}" data-toggle="tooltip" data-placement="top" title="Copy to Cipboard" style="float:right;margin-top:-2.8rem;margin-right:5.8rem;background-color:white" onClick="Copy_Code('${Compiler}')" ><img src="https://static.thenounproject.com/png/5418785-200.png" width="20px" height="20px"></button>
                          <button type="button" class="border border-dark border-2" id="toggle_button_${Compiler}"  style="float:right;margin-top:-2.8rem;margin-right:2.8rem;background-color:white" onClick="Toggle_Compiler('${Compiler}')"><img src="https://static.thenounproject.com/png/3293059-200.png" width="20px" height="20px"></button>
                          <button type="button" class="btn-close border border-dark border-2" aria-label="Close" btn-close-color:"black" style="float:right;opacity:1.5; margin-top:-2.8rem;border-radius:0;background-color:white;padding:0.75em 0.75em;font-size:72%;" onClick="Close_Compiler('${Compiler}')"></button>
                      </div>
                  </div>
                  <div class="body">
                      <input type="hidden" id="lang_input">
                      <input type="hidden" id="folder_input">
                      <input type="hidden" id="filename_input">
                      <div class="compiler" style="position:relative;">
                      <div class="program" style="width: 100%;height: 100%;position: relative;">
                          <textarea id="compiler_textarea_${Compiler}" placeholder="write your code ......."></textarea>
                          <button type="button" id="compile_code" class="compile_code btn btn-info custom-btn-color shadow-none" onClick="Compile('${Compiler}')">Run</button>
                      </div>
                          <div class="compile_result" id="result_java_${Compiler}">
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>`;
            button.insertAdjacentElement("afterend", newElement);
        }
    }
}

function megaMenu_close(menuId) {
    const megaMenu = document.querySelector(`#${menuId}`);
    const navBarAnchorTag = document.querySelector('.nav-link.dropdown-toggle.show');
    const navBar = megaMenu.parentElement;
    navBar.style.backgroundColor = '';
    navBarAnchorTag.classList.remove('show');
    megaMenu.classList.remove('show');
    navBarAnchorTag.removeAttribute('aria-expanded');
    navBar.classList.remove('show');
    map1.delete(menuId);
}

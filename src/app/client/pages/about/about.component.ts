import { Component } from '@angular/core';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent {
    features = [
        { icon: 'local_shipping', title: 'Fast Delivery', description: 'Get your groceries delivered within hours' },
        { icon: 'verified', title: 'Quality Products', description: '100% fresh and organic products guaranteed' },
        { icon: 'payments', title: 'Secure Payment', description: 'Multiple payment options with secure checkout' },
        { icon: 'support_agent', title: '24/7 Support', description: 'Round the clock customer support' }
    ];
}
